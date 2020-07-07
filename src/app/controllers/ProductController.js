const { Product } = require('../models');
const fieldValidation = require('../../utils/fieldValidation');
const errorLogger = require('../../utils/errorLogger');
const Sequelize = require('sequelize');

class ProductController {
    async register(req, res) {
        const { name,
            description,
            category,
            price,
            avaliableUnits } = req.body;

        const anyAreEmpty = fieldValidation.areEmpty({
            name,
            description,
            category,
            price,
            avaliableUnits
        });

        const anyArentNumbers = fieldValidation.areNotNumbers({ price, avaliableUnits });

        if (anyAreEmpty) {

            return res.status(422).json({ error: anyAreEmpty });

        } else if (anyArentNumbers) {

            return res.status(422).json({ error: anyArentNumbers });

        } else {
            try {
                const product = await Product.create({
                    name,
                    description,
                    category,
                    price,
                    avaliableUnits
                });

                return res.status(200).json({
                    product
                });

            } catch (err) {
                errorLogger(err);
                return res.status(500).json({ error: ["Internal server error"] });
            }

        }
    }

    async delete(req, res) {
        const { id } = req.params;
        const noId = fieldValidation.areEmpty({ id });

        if (noId) {
            return res.status(422).json({
                error: noId
            });
        }

        const affectedRows = await Product.update({ isActive: false }, {
            where: { id, isActive: true }
        });

        if (affectedRows[0]) {
            return res.status(200).json({
                success: ['Product successfully deleted']
            });

        } else {

            return res.status(404).json({
                error: ['Nothing to update']
            });

        }
    }

    async update(req, res) {
        const { id } = req.params;
        const noId = fieldValidation.areEmpty({ id });

        if (noId) {
            return res.status(422).json({
                error: noId
            });
        }

        // Descrutured so we don't get any aditional data
        const {
            name,
            description,
            category,
            price,
            avaliableUnits
        } = req.body;

        const updateParams = {
            name,
            description,
            category,
            price,
            avaliableUnits
        };

        Object.keys(updateParams).forEach(key => {
            return typeof updateParams[key] === 'undefined' ? delete updateParams[key] : {}
        });

        if (Object.keys(updateParams).length) {

            const affectedRows = await Product.update(updateParams, {
                where: { id, isActive: true }
            });
            
            if (affectedRows[0]) {

                const product = await Product.findOne({
                    where: { id }
                });

                return res.status(200).json({
                    product
                });

            } else {

                return res.status(404).json({
                    error: ['No product found']
                });

            }
        } else {
            return res.status(422).json({
                error: ['You need at least one field to update']
            });
        }

    }

    async get(req, res) {
        const { id } = req.params;

        if (typeof id === 'undefined') {
            try {
                const products = await Product.findAll({ where: { isActive: true } });

                return res.status(200).json({
                    products
                });

            } catch (err) {
                errorLogger(err);
                return res.status(500).json({ error: ["Internal server error"] });
            }
        } else {
            try {
                const product = await Product.findOne({ where: { id, isActive: true } });

                if (!product) {
                    return res.status(404).json({ error: ["No product found"] });
                } else {
                    return res.status(200).json({
                        product
                    });
                }
            } catch (err) {
                errorLogger(err);
                return res.status(500).json({ error: ["Internal server error"] });
            }
        }
    }

    async search(req, res) {
        let { query } = req.body;

        let { limit, page } = req.params;

        limit = Number(limit);
        page = Number(page);

        const paged = /result-limit\/[0-9]+\/page\/[0-9]+/.test(req.url);
        const emptyQuery = fieldValidation.areEmpty({ query });

        let pagination = {};

        if (emptyQuery) {
            return res.status(422).json({ error: emptyQuery });
        }

        query = '%' + query.toLowerCase() + '%';

        if (paged) {

            const anyArentNumbers = fieldValidation.areNotNumbers({ limit, page });

            if (anyArentNumbers) {
                return res.status(422).json({ error: anyArentNumbers });
            } else {
                const products = await Product.findAndCountAll({
                    where: Sequelize.literal('isActive = true AND (lower(name) LIKE :query OR lower(description) LIKE :query OR lower(category) LIKE :query)'),
                    replacements: { query },
                    limit: limit,
                    offset: (limit * page - limit)
                });

                if (!products.rows.length) {
                    return res.status(404).json({ error: ["No product found"] });
                } else {
                    return res.status(200).json({
                        total: products.count,
                        pages: Math.ceil(products.count / limit),
                        products: products.rows
                    });
                }
            }
        } else {

            const products = await Product.findAll({
                where: Sequelize.literal('lower(name) LIKE :query OR lower(description) LIKE :query OR lower(category) LIKE :query'),
                replacements: { query }
            });

            if (!products) {
                return res.status(404).json({ error: ["No product found"] });
            } else {
                return res.status(200).json({
                    products
                });
            }
        }

    }

}

module.exports = new ProductController();