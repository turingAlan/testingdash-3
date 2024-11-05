import fs from 'fs'

const languages = [
  { language: 'English', native: 'English', iso: 'en' },
  { language: 'Hindi', native: 'हिन्दी', iso: 'hi' },
  { language: 'Bengali', native: 'বাংলা', iso: 'bn' },
  { language: 'Telugu', native: 'తెలుగు', iso: 'te' },
  { language: 'Marathi', native: 'मराठी', iso: 'mr' },
  { language: 'Tamil', native: 'தமிழ்', iso: 'ta' },
  { language: 'Urdu', native: 'اردو', iso: 'ur' },
  { language: 'Gujarati', native: 'ગુજરાતી', iso: 'gu' },
  { language: 'Kannada', native: 'ಕನ್ನಡ', iso: 'kn' },
  { language: 'Odia', native: 'ଓଡ଼ିଆ', iso: 'or' },
  { language: 'Malayalam', native: 'മലയാളം', iso: 'ml' },
  { language: 'Punjabi', native: 'ਪੰਜਾਬੀ', iso: 'pa' },
]

const data = [
  {
    errorStreet: "Street can't be blank",
  },
  {
    errorBuilding: "Building can't be blank",
  },
]

const translate = async (value, targetLang) => {
  var myHeaders = new Headers()

  myHeaders.append('Accept', ' */*')
  myHeaders.append(
    'User-Agent',
    ' Thunder Client (https://www.thunderclient.com)'
  )

  // bhasini api
  myHeaders.append(
    'Authorization',
    'qIHpqWhVqghRahNZ8nhWeuDq-z-wo_ceak1iPI6cbMVzxH-fTWTVrsuc7BIEYbU9'
  )
  myHeaders.append('Content-Type', 'application/json')

  var raw = JSON.stringify({
    pipelineTasks: [
      {
        taskType: 'translation',
        config: {
          language: {
            sourceLanguage: 'en',
            targetLanguage: targetLang,
          },
          serviceId: 'ai4bharat/indictrans-v2-all-gpu--t4',
        },
      },
    ],
    inputData: {
      input: [
        {
          source: value,
        },
      ],
    },
  })

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  }

  try {
    const apiData = await fetch(
      'https://dhruva-api.bhashini.gov.in/services/inference/pipeline',
      requestOptions
    )

    const apiResponse = await apiData.json()

    const translatedText =
      apiResponse?.pipelineResponse?.[0]?.output?.[0]?.target

    if (targetLang === 'en') {
      return value
    } else {
      return translatedText
    }
  } catch (error) {
    console.error('Error translating text:', error)
    
return value
  }
}

const translateAll = async () => {
  for (let j = 0; j < languages.length; j++) {
    const newTranslatedData = {}

    for (let i = 0; i < data.length; i++) {
      const [key, value] = Object.entries(data[i])[0]
      const translatedValue = await translate(value, languages[j].iso)

      newTranslatedData[key] = translatedValue
    }

    console.log(newTranslatedData, languages[j].iso)

    writeToFile(newTranslatedData, languages[j].iso)
  }
}

const writeToFile = (newData, targetLang) => {
  let currentData = {}

  try {
    currentData = JSON.parse(
      fs.readFileSync(
        `./${targetLang}.json`,
        'utf-8'
      )
    )
  } catch (error) {
    console.error(`Error reading file for ${targetLang}:`, error)
  }

  fs.writeFileSync(
    `./${targetLang}.json`,
    JSON.stringify({ ...currentData, ...newData }, null, 2)
  )
}

translateAll()
