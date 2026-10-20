"""Convert a private admin queue export to cropped, grouped training data."""
import argparse
import base64
import hashlib
import io
import json
from pathlib import Path
from PIL import Image
from train_classifier import LABELS

def prepare(export, output):
    data = json.loads(Path(export).read_text())
    if data.get('schema') != 'mahjong-training-export-v1':
        raise ValueError('Unsupported queue export')
    output = Path(output)
    if output.exists():
        raise ValueError('Output folder already exists')
    jobs = data.get('jobs')
    if not isinstance(jobs, list) or not jobs or len(jobs) > 128:
        raise ValueError('Expected 1..128 candidate photos')
    # Validate everything before producing a dataset.
    prepared = []
    seen = {}
    for job in jobs:
        source = job['image_sha256']
        if len(source) != 64 or any(c not in '0123456789abcdef' for c in source):
            raise ValueError('Invalid photo source hash')
        encoded = job['photo_data']
        if not isinstance(encoded, str) or len(encoded) > 800000 or not encoded.startswith('data:image/jpeg;base64,'):
            raise ValueError('Invalid training photo')
        image = Image.open(io.BytesIO(base64.b64decode(encoded.split(',', 1)[1], validate=True)))
        if image.size != (job['width'], job['height']) or image.width * image.height > 16000000:
            raise ValueError('Photo dimensions mismatch')
        image = image.convert('RGB')
        annotations = job['labels']
        if not isinstance(annotations, list) or not 1 <= len(annotations) <= 26:
            raise ValueError('No complete annotations')
        signature = json.dumps(annotations, sort_keys=True)
        if source in seen:
            if seen[source] != signature:
                raise ValueError('Conflicting labels for duplicate photo')
            continue
        seen[source] = signature
        # An explicit session grouping can be added by the dataset curator.
        group = job.get('capture_group') or source
        bucket = int(hashlib.sha256(group.encode()).hexdigest()[:8], 16) % 10
        split = 'train' if bucket < 7 else 'validation' if bucket == 7 else 'test'
        for i, a in enumerate(annotations):
            if a['tile'] not in LABELS or len(a['box']) != 4:
                raise ValueError('Invalid tile annotation')
            x, y, r, b = a['box']
            if not all(isinstance(v, (int, float)) for v in a['box']) or not (0 <= x < r <= image.width and 0 <= y < b <= image.height):
                raise ValueError('Invalid tile box')
            prepared.append((f'{source}-{i}.png', image.crop((int(x), int(y), int(r+.999), int(b+.999))), group, split, a['tile']))
    output.mkdir(parents=True)
    samples = []
    for name, crop, source, split, tile in prepared:
        crop.save(output/name)
        samples.append(dict(image=name, source=source, split=split, tile=tile))
    (output/'dataset.json').write_text(json.dumps({'samples': samples}, indent=2))
    (output/'receipt.json').write_text(json.dumps({'jobIds':[j['id'] for j in jobs], 'state':'prepared-only', 'modelAccepted':False}))
    return len(samples)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('export')
    parser.add_argument('output')
    args = parser.parse_args()
    print(json.dumps({'tiles':prepare(args.export, args.output), 'modelAccepted':False}))
