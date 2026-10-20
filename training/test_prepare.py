import base64
import io
import json
import tempfile
import unittest
from pathlib import Path
from PIL import Image
from prepare_export import prepare

class PrepareTests(unittest.TestCase):
    def test_exports_pixels_and_labels_without_approving_or_deleting_originals(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            image = io.BytesIO()
            Image.new('RGB', (100, 100), 'white').save(image, format='JPEG')
            job = dict(id='fixture',image_sha256='a'*64,photo_data='data:image/jpeg;base64,'+base64.b64encode(image.getvalue()).decode(),width=100,height=100,labels=[dict(tile='east',box=[10,10,30,50])])
            path = root/'export.json'
            path.write_text(json.dumps(dict(schema='mahjong-training-export-v1',jobs=[job])))
            self.assertEqual(prepare(path, root/'dataset'), 1)
            dataset=json.loads((root/'dataset/dataset.json').read_text())
            with Image.open(root/'dataset'/dataset['samples'][0]['image']) as crop:
                self.assertEqual(crop.size,(20,40))
            self.assertTrue(path.exists())
            self.assertFalse(json.loads((root/'dataset/receipt.json').read_text())['modelAccepted'])
            with self.assertRaises(ValueError):
                prepare(path, root/'dataset')
if __name__=='__main__':unittest.main()
