const BaseRepository = require("./base.repository");
const ResultadoSchema = require("../models/resultado.model");

class ResultadoRepository extends BaseRepository {
  constructor() {
    super(ResultadoSchema);
  }
}

module.exports = ResultadoRepository;
