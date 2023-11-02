const { StatusCodes } = require("http-status-codes");

class BaseController {
  constructor(repoClass) {
    this.repo = new repoClass();
  }
  getAll = (req, res) => {
    this.repo
      .findAll()
      .then((doc) => {
        return res.status(StatusCodes.OK).send({ res: "0", message: doc });
      })
      .catch((err) => {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ res: "error", error: err });
      });
  };
  add = (req, res) => {
    const body = req.body;
    this.repo
      .create(body)
      .then((doc) => {
        return res.status(StatusCodes.CREATED).send({ res: "0", message: doc });
      })
      .catch((err) => {
        return res
          .status(StatusCodes.StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ res: "error", message: err });
      });
  };
  update = (req, res) => {
    const body = req.body;
    this.repo
      .update(body)
      .then((doc) => {
        return res.status(StatusCodes.OK).send({ res: "0", message: doc });
      })
      .catch((err) => {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ res: "error", message: err });
      });
  };
  deleteById = (req, res) => {
    let id = req.params.id;
    if (id.trim() === "")
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ res: "error", message: "invalid param" });
    this.repo
      .deleteById(id)
      .then((doc) => {
        return res.status(StatusCodes.CREATED).send({ res: "0", message: doc });
      })
      .catch((err) => {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ res: "error", message: err });
      });
  };
  getById = (req, res) => {
    let id = req.params.id;
    if (id.trim() === "")
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ res: "error", message: "invalid param" });

    this.repo
      .findById(id)
      .then((doc) => {
        if (doc)
          return res.status(StatusCodes.OK).send({ res: "0", message: doc });

        return res
          .status(StatusCodes.NOT_FOUND)
          .send({ res: "error", message: "not found" });
      })
      .catch((err) => {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ res: "error", message: err });
      });
  };
}

module.exports = BaseController;
