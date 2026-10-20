"""Train a small supervised tile classifier. Outputs a candidate, never a release."""
import argparse
import hashlib
import json
from pathlib import Path
import numpy as np
from PIL import Image

LABELS = [s + str(i) for s in ('char', 'dot', 'bam') for i in range(1, 10)] + ['east', 'south', 'west', 'north', 'red', 'green', 'white'] + [s + str(i) for s in ('flower', 'season') for i in range(1, 5)]
SIZE = 24

def load_dataset(path):
    path = Path(path).resolve()
    root = path.parent
    rows = json.loads(path.read_text())['samples']
    sources, pixels, splits = {}, {}, {s: [] for s in ('train', 'validation', 'test')}
    for row in rows:
        split, source, tile = row['split'], row['source'], row['tile']
        if split not in splits or not isinstance(source, str) or not source or tile not in LABELS:
            raise ValueError('Invalid split, source or tile')
        if source in sources and sources[source] != split:
            raise ValueError('Source leakage across splits')
        sources[source] = split
        file = (root / row['image']).resolve()
        if not file.is_relative_to(root):
            raise ValueError('Image outside dataset directory')
        digest = hashlib.sha256(file.read_bytes()).hexdigest()
        if digest in pixels and pixels[digest] != split:
            raise ValueError('Identical image leakage across splits')
        pixels[digest] = split
        with Image.open(file) as image:
            if image.width * image.height > 40000000:
                raise ValueError('Image too large')
            x = np.asarray(image.convert('RGB').resize((SIZE, SIZE), Image.Resampling.BILINEAR), dtype=np.float32).reshape(-1) / 127.5 - 1
        splits[split].append((x, LABELS.index(tile)))
    if any(not rows for rows in splits.values()):
        raise ValueError('All three splits are required')
    if {y for _, y in splits['train']} != set(range(len(LABELS))):
        raise ValueError('Training must cover all 42 tile classes')
    return {k: (np.stack([x for x, _ in v]), np.array([y for _, y in v])) for k, v in splits.items()}, sources

def probabilities(x, weights):
    w1, b1, w2, b2 = weights
    h = np.maximum(x @ w1 + b1, 0)
    z = h @ w2 + b2
    z -= z.max(axis=1, keepdims=True)
    p = np.exp(z)
    p /= p.sum(axis=1, keepdims=True)
    return h, p

def train(splits, epochs=100, seed=1591):
    rng = np.random.default_rng(seed)
    x, y = splits['train']
    weights = [rng.normal(0, .02, (SIZE * SIZE * 3, 64)).astype('float32'), np.zeros(64, dtype='float32'), rng.normal(0, .02, (64, len(LABELS))).astype('float32'), np.zeros(len(LABELS), dtype='float32')]
    best, best_loss, stale = None, float('inf'), 0
    for epoch in range(epochs):
        for batch in np.array_split(rng.permutation(len(x)), max(1, (len(x) + 31) // 32)):
            xb, yb = x[batch], y[batch]
            h, p = probabilities(xb, weights)
            p[np.arange(len(batch)), yb] -= 1
            p /= len(batch)
            dh = (p @ weights[2].T) * (h > 0)
            gradients = [xb.T @ dh + .0001 * weights[0], dh.sum(axis=0), h.T @ p + .0001 * weights[2], p.sum(axis=0)]
            for w, g in zip(weights, gradients):
                w -= .02 * np.clip(g, -5, 5)
        vx, vy = splits['validation']
        _, vp = probabilities(vx, weights)
        loss = float(-np.log(np.maximum(vp[np.arange(len(vy)), vy], 1e-8)).mean())
        if loss < best_loss - 1e-5:
            best, best_loss, stale = [w.copy() for w in weights], loss, 0
        else:
            stale += 1
        if stale >= 15:
            break
    return best

def candidate(splits, sources, weights):
    metrics = {}
    for split, (x, y) in splits.items():
        _, p = probabilities(x, weights)
        metrics[split] = {'tiles': len(y), 'accuracy': float((p.argmax(axis=1) == y).mean()), 'classCoverage': len(set(y.tolist()))}
    return {'schema': 'mahjong-rgb24-mlp-v1', 'status': 'candidate', 'labels': LABELS, 'size': SIZE, 'hidden': 64, 'weights': [w.tolist() for w in weights], 'metrics': metrics, 'splitLeakage': False, 'sourceCounts': {s: sum(v == s for v in sources.values()) for s in splits}, 'releaseApproved': False}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('dataset')
    parser.add_argument('output')
    parser.add_argument('--epochs', type=int, default=100)
    args = parser.parse_args()
    if not 1 <= args.epochs <= 1000:
        parser.error('epochs must be 1..1000')
    splits, sources = load_dataset(args.dataset)
    output = Path(args.output)
    if output.exists():
        raise ValueError('Refusing to overwrite model artifact')
    result = candidate(splits, sources, train(splits, args.epochs))
    output.write_text(json.dumps(result, separators=(',', ':'), allow_nan=False))
    print(json.dumps({'status': 'candidate-only', 'metrics': result['metrics'], 'releaseApproved': False}))

if __name__ == '__main__':
    main()
