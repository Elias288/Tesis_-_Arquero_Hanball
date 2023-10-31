
class BaseRepository {
    constructor(_collection) {
        this.collection = _collection;
    }
    findAll() {
        return this.collection.find().lean().exec();
    }
    findById(id) {
        return this.collection.findById(id);
    }
    create(model) {
        return this.collection.create(model);
    }
    update(model) {
        return this.collection.findByIdAndUpdate(model._id, model);
    }
    deleteById(id) {
        return this.collection.findByIdAndDelete(id);
    }
}

module.exports = BaseRepository;