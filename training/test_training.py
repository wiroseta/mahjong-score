import json
import tempfile
import unittest
from pathlib import Path
import numpy as np
from PIL import Image
from train_classifier import LABELS, load_dataset, train, candidate

class TrainingTests(unittest.TestCase):
    def test_training_and_source_leakage(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            rows = []
            for split in ('train', 'validation', 'test'):
                for i, tile in enumerate(LABELS):
                    name = f'{split}-{i}.png'
                    Image.new('RGB', (24, 24), ((i*7)%256, (i*13)%256, (i*19 + len(split))%256)).save(root/name)
                    rows.append(dict(image=name, source=f'{split}-{i}', split=split, tile=tile))
            path = root/'dataset.json'
            path.write_text(json.dumps({'samples':rows}))
            splits, sources = load_dataset(path)
            result = candidate(splits, sources, train(splits, epochs=2))
            self.assertEqual(result['status'], 'candidate')
            self.assertFalse(result['releaseApproved'])
            self.assertEqual(result['metrics']['test']['tiles'], len(LABELS))
            rows[-1]['source'] = rows[0]['source']
            path.write_text(json.dumps({'samples':rows}))
            with self.assertRaisesRegex(ValueError, 'Source leakage'):
                load_dataset(path)

if __name__ == '__main__':
    unittest.main()
