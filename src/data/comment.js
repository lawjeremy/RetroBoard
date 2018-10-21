import axios from 'axios';
import config from './config';

const apiKey = window.localStorage.getItem('apiKey');

const fetch = async () => {

  console.log('fetching comments..');
  
  if(!apiKey){
    console.log('No api key in localstorage');
    return [];
  }

  try{
    const response = await axios.get(config.api.host + 'comment', {
      headers: {
        "x-api-key": apiKey
      }
  
    }); 

    return response.data.body.Items;
  }catch(error){
    console.log(error);
    return [];
  }
    

};

const save = (comment) => {
  console.log('adding comment...');

  if(!apiKey){
    console.log('No api key in localstorage');
    return [];
  }

  return [];
};

export { save, fetch };