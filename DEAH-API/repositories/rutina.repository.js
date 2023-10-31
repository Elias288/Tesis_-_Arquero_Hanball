const BaseRepository = require("./base.repository");
const RutinaSchema = require("../models/rutina.model");

class RutinaRepository extends BaseRepository {
  constructor() {
    super(RutinaSchema);
  }
}

module.exports = RutinaRepository;
