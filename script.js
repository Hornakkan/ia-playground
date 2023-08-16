let activities = document.getElementById('activities');
let token = document.getElementById('api-token');
let answer = document.getElementById('answer');

activities.addEventListener('change', () => {
  if(token.value) {
    this.getAnswer(parseInt(activities.value));
  } else {
    answer.textContent = 'No token provided';
  }
})

function getAnswer(testCase) {
  var myHeaders = new Headers();
  let activity, model, properties;
  myHeaders.append("Output-format", "JSON");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + token.value);
  
  answer.textContent = 'Fetching data from IA ...';

  switch(testCase) {
    case 1:
      activity = 'electromenager';
      model = 'Atlantic 151115 CE ACI VM MONO ELECT. 150L';
      properties = 'name,manufacturer,reference,features,description,meta_title,meta_description,meta_keywords'
      break;
    case 2:
      activity = 'deux_roues';
      model = 'APRILIA MOTO 6.5 STARK 1995-2003';    
      properties = 'name,manufacturer,year_begin,year_end,displacement,features,description,meta_title,meta_description,meta_keywords';
      break;
    case 3:
      activity = 'jardin';
      model = 'HUSQVARNA AUTOMOWER 305';    
      properties = 'name,manufacturer,reference,features,description,meta_title,meta_description,meta_keywords'
      break;
    case 4:
      activity = 'imprimante';
      model = 'Zebra ZT421T';
      properties = 'name,manufacturer,reference,features,description,meta_title,meta_description,meta_keywords'    
      break;    
    case 5:
      activity = 'agriculture';
      model = 'Case 845XL';
      properties = 'name,manufacturer,reference,features,description,meta_title,meta_description,meta_keywords'    
      break;
  }
  
  var raw = JSON.stringify({
    "model": "gpt-3.5-turbo",
    "messages": [
      {
          "role": "system",
          "content": `Tu es un spécialiste de la pièce détachée dans le domaine ${activity}`
      },
      {
        "role": "user",
        "content": `Génère un JSON des données techniques en français pour ${model} avec les propriétés: ${properties}`
      }
    ]
  });
  
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  
  fetch("https://api.openai.com/v1/chat/completions", requestOptions)
      .then(response => response.json())
      // .then(result => console.log(result))
      // .then(result => console.log(JSON.parse(result.choices[0].message.content)))
    .then(result => {
      // data = JSON.parse(result.choices[0].message.content);
      // console.log(result);
      let message = result.choices[0].message.content;
      if(message.includes("```")) {
          // console.log('Contains ```');
          msg = message.split("```");
          data = JSON.parse(msg[1].substr(4));
      } else {
          try{
              // console.log('Doesn\'t contain ```');
              data = JSON.parse(message);
          }
          catch(error) {
              data = 'KO';
              console.log(message);
              answer.textContent = error;
          }
      }
      answer.textContent = JSON.stringify(data, undefined, 2);
    })
    .catch(error => {
      console.log('error', error);
      answer.textContent = error;
    });
}