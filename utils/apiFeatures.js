class apiFeatures {
  constructor(mongooseQuery, queryString = {}) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  } 
  paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 20;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);
    if (endIndex < countDocuments) {
      pagination.nextPage = page + 1;
    }
    if (skip > 0) {
      pagination.prevPage = page - 1;
    } 
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;
    return this;
  }
  search() {
    if (
      this.queryString.keyword &&
      typeof this.queryString.keyword === "string"
    ) {

      let query = {};
      query.$or = [
        { title: { $regex: this.queryString.keyword, $options: "i" } },
        { author: { $regex: this.queryString.keyword, $options: "i" } },
        { genre: { $regex: this.queryString.keyword, $options: "i" } },
      ];
      this.mongooseQuery = this.mongooseQuery.find(query);
      // this.mongooseQuery = this.mongooseQuery.find({
      //   $text: { $search: this.queryString.keyword },
      // });
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-averageRating");
    }
    return this;
  }
  filter() {
    const queryStringObj = { ...this.queryString };
    const excludesFields = ["page", "sort", "limit", "keyword"];
    excludesFields.forEach((field) => delete queryStringObj[field]);
    // Apply filtration using [gte, gt, lte, lt]
   
      let queryStr = JSON.stringify(queryStringObj);
      queryStr = queryStr.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      );
      this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    
   

    return this;
  }
}

module.exports = apiFeatures;