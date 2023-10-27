const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// find all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// find a single product by its `id`
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });
    if (!product) {
      res.status(404).json({ message: 'No product with this id!' });
      return;
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post("/", async (req, res) => {
  /* req.body should look like this...
   {
     "product_name": "Basketball",
     "price": 200.00,
     "stock": 3,
     "tagIds": [1, 2, 3, 4]
   }
 */
  try {
    if (req.body) {
      const newProduct = await Product.create(req.body);
      await newProduct.addTags(req.body.tagIds);
      res.status(200).json(newProduct);
    } 
  } catch (err) {
    res.status(500).json(err);
  }
});

// update product
router.put("/:id", async (req, res) => {
  try {
    const productUpdated = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    if (productUpdated[0] === 0) {
      res.status(404).json({ message: 'No product with this id!' });
      return;
    }

    const product = await Product.findByPk(req.params.id);
    await ProductTag.destroy({
      where: { product_id: req.params.id }
    }),
      await product.addTags(req.body.tagIds);
    res.status(200).json({ message: "Product updated" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete one product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!deletedProduct) {
      res.status(404).json({ message: 'No product with this id!' });
      return;
    }
    res.status(200).json({ message: 'Product deleted.' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
