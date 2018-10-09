const getCurrentTimeDate = function () {
  var currentdate = new Date(); 
  return currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
}


async function flattenArray(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flattenArray(toFlatten) : toFlatten);
  }, []);
}

const getContent = function (url) {
  // return new pending promise
  return new Promise((resolve, reject) => {
    // select http or https module, depending on reqested url
    const lib = url.startsWith('https') ? require('https') : require('http');
    const request = lib.get(url, (response) => {
      // handle http errors
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error('Failed to load page, status code: ' + response.statusCode));
      }
      // temporary data holder
      const body = [];
      // on every content chunk, push it to the data array
      response.on('data', (chunk) => body.push(chunk));
      // we are done, resolve promise with those joined chunks
      response.on('end', () => resolve(body.join('')));
    });
    // handle connection errors of the request
    request.on('error', (err) => reject(err))
  })
};

const postContent = function (url, data) {
  // return new pending promise
  return new Promise((resolve, reject) => {
   
    let options = {
      uri: url,
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
           'Content-Type': 'application/json',
           'Content-Length': data.length
         }
    };
     // select http or https module, depending on reqested url
    const lib = url.startsWith('https') ? require('https') : require('http');
    const request = lib.request(options, (response) => {
      // handle http errors
      console.log('sending Post Data!')
      console.log(respose);
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error('Failed to load page, status code: ' + response.statusCode));
      }
      // temporary data holder
      const body = [];
      // on every content chunk, push it to the data array
      response.on('data', (chunk) => body.push(chunk));
      // we are done, resolve promise with those joined chunks
      response.on('end', () => resolve(body.join('')));
    });
    // handle connection errors of the request
    request.on('error', (err) => reject(err))
  })
};

function comparer(otherArray) {
  return function (current) {
    return otherArray.filter(function (other) {
      return other.endpoint == current.endpoint && other.providerName == current.providerName
    }).length == 0;
  }
};

module.exports = {
  getCurrentTimeDate:getCurrentTimeDate,
  flattenArray: flattenArray,
  comparer: comparer,
  getContent: getContent,
  postContent: postContent
}
