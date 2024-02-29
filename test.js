let ids = [];

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

for(let i = 30; i<500; i++) {
  ids.push(i);
}

// ids.forEach((item, index) => {
//   setTimeout(() => {
//     goFetchProduct(item);
//   }, index * 1000)
// })

// function goFetchProduct(item) {
//   let myBody = JSON.stringify({
//     id: item,
//     name: "Ceci est un produit de test",
//     reference: "produit-de-test-20",
//     ean13: "987-654-321-00",
//     supplier_reference: "Test supplier"
//   });

//   var myHeaders = new Headers();
//   myHeaders.append("Authorization", "Bearer Hg1QeUS3R3dISX2bC0KseU7mclNXRbsTxv7z8p5r");
//   myHeaders.append("Content-Type", "application/json");

//   var requestOptions = {
//     method: 'PUT',
//     headers: myHeaders,
//     redirect: 'follow',
//     body: myBody,
//   };

//   fetch("https://ukoo-parts-manager.localhost/api/products/store", requestOptions)
//     .then((response) => response.text())
//     .then( (result) => console.log(result))
//     .catch(error => {
//       console.error('error', error);
//     });
// }

(async () => {
  for (const id of ids) {
    await fetchAndRetryIfNecessary((attempt = 0) => callTheAPI(id, attempt, 0, id))
  }
})();

function sleep (milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

function getMillisToSleep (retryHeaderString) {
  let millisToSleep = Math.round(parseFloat(retryHeaderString) * 1000)
  if (isNaN(millisToSleep)) {
    millisToSleep = Math.max(0, new Date(retryHeaderString) - new Date())
  }
  return millisToSleep
}

async function fetchAndRetryIfNecessary (callAPI, attempt = 0, index) {
  const response = await callAPI(index, attempt)
  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After') ?? 1 * attempt;
    const millisToSleep = getMillisToSleep(retryAfter)
    console.log('❗ Retrying:  ', index, `attempt:${attempt + 1}`, 'at', retryAfter, 'sleep for', millisToSleep, 'ms')
    await sleep(millisToSleep)
    return fetchAndRetryIfNecessary(callAPI, attempt + 1, index)
  }
  return response
}

async function callTheAPI (item, attempt = 0) {
    let myBody = JSON.stringify({
      id: item,
      name: "Ceci est un produit de test",
      reference: "produit-de-test-20",
      ean13: "987-654-321-00",
      supplier_reference: "Test supplier"
    });

  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer Hg1QeUS3R3dISX2bC0KseU7mclNXRbsTxv7z8p5r");
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    redirect: 'follow',
    body: myBody,
  };

  const response = await fetch("https://ukoo-parts-manager.localhost/api/products/store", requestOptions);

  console.log('Request End:  ', item, `attempt:${attempt}`, 'status:' , response.status);
  return response;
}