class APIFeatures {
  constructor(query, queryString){
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
// 1) FILTERING
    const queryObj = {...this.queryString}; //take the field out of the object and create a new object, so we don't manipulate the original 
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]); // forEach doesn't save a new array
// 2) ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
      if(this.queryString.sort) {
      const srotBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(srotBy);
    } else {
      this.query = this.query.sort('-_id');
    }
    return this;
  }

  limitFields() {
      if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v')
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page -1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
};
module.exports = APIFeatures;