const httpStatusCodes = require('http-status-codes');

class BaseController {
    constructor(repoClass) {
        this.repo = new repoClass();
    }
    getAll = (req, res) => {
        this.repo.findAll().then(doc => {
            return res.status(httpStatusCodes.OK).send(doc);
        }).catch(err => {
            console.log(err);
            return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send(err);
        })
    }
    add = (req, res) => {
        const body = req.body;
        this.repo.create(body).then(doc => {
            return res.status(httpStatusCodes.CREATED).send(doc);
        }).catch(err => {
            console.log(err);
            return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send(err);
        })
    }
    update = (req, res) => {
        let id = req.params.id;
        const body = req.body;
        this.repo.update(body).then(doc => {
            return res.status(httpStatusCodes.OK).send(doc);
        }).catch(err => {
            console.log(err);
            return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send(err);
        })
    }
    deleteById = (req, res) => {
        let id = req.params.id;
        this.repo.deleteById(id).then(doc => {
            return res.status(httpStatusCodes.CREATED).send(doc);
        }).catch(err => {
            console.log(err);
            return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send(err);
        })
    }
    getById = (req, res) => {
        let id = req.params.id;
        this.repo.findById(id).then(doc => {
            return res.status(httpStatusCodes.OK).send(doc);
        }).catch(err => {
            console.log(err);
            return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send(err);
        })
    }
}

module.exports = BaseController;