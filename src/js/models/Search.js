import axios from 'axios';

export default class Search {
  constructor(query) {
    this.query = query;
  }

 async getResults() {
    const key = '880f2cc7c156d11a61c8d9c2d85c585d';
    try {
      const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.result = res.data.recipes;
    }
    catch(error) {
      console.log(error)
    }
  }
}




