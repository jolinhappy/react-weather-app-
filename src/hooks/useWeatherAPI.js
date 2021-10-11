import { useState, useEffect, useCallback } from 'react';

const fetchCurrentWeather = ({ authorizationKey, locationName }) => {
  return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`)
    .then((response) => response.json())
    .then((data) => {
      const locationData = data.records.location[0]
      const weatherElements = locationData.weatherElement.reduce((neededElements, item) => {
        // 第一個參數是最後被整理完成的新物件，因為initialValue設定為{}，所以這裡的第一個參數代表物件
        // 第二個參數是現在比對中的參數(遍歷)
        if (['WDSD', 'TEMP'].includes(item.elementName)) {
          // 如果符合條件，就塞進neededElement這個物件
          // 用對應的WDSD和TEMP當作KEY，對應的value當作值塞入物件(下方這句)
          neededElements[item.elementName] = item.elementValue
        }
        return neededElements
      }, {}
      )
      //把整理好的物件資料帶入setSomthing裡面
      return {
        locationName: locationData.locationName,
        windSpeed: weatherElements.WDSD,
        temperature: weatherElements.TEMP,
        observationTime: locationData.time.obsTime,
        isLoading: false
      }
    })
}
const fetchWeatherForecast = ({ authorizationKey, cityName }) => {
  return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`)
  .then((response) => response.json())
  .then((data) => {
    const locationData = data.records.location[0];
    const weatherElements = locationData.weatherElement.reduce((neededElements, item) => {
      if (['Wx', "PoP", 'CI'].includes(item.elementName)) {
        // 如果符合條件，就塞進neededElement這個物件
        // 用對應的WDSD和TEMP當作KEY，對應的value當作值塞入物件(下方這句)
        neededElements[item.elementName] = item.time[0].parameter;
      }
      return neededElements
      }, {})
    // 把整理好的物件資料帶入setSomthing裡面
    return {
      description: weatherElements.Wx.parameterName,
      weatherCode: weatherElements.Wx.parameterValue,
      rainPossibility: weatherElements.PoP.parameterName,
      comfortability: weatherElements.CI.parameterName,
    }
  })
}

const useWeatherAPI = ({ locationName, cityName, authorizationKey }) => {
  const [weatherElement, setWeatherElement] = useState({
    locationName: '',
    description: '',
    windSpeed: 0,
    temperature: 0,
    rainPossibility: 0,
    observationTime: '0',
    comfortability: '0',
    weatherCode: 0,
    isLoading: true,
  });

  const fetchData = useCallback(async() => {
    setWeatherElement((prevState) => ({
      ...prevState,
      isLoading: true
    }))
    const [currentWeather, weatherForecast] = await Promise.all([
      fetchCurrentWeather({ authorizationKey, locationName }), 
      fetchWeatherForecast({ authorizationKey, cityName })
    ])
    setWeatherElement({
      ...currentWeather,
      ...weatherForecast,
      isLoading: false
    })
  }, [authorizationKey, cityName, locationName])

  useEffect(() => { fetchData() }, [fetchData])

  return [weatherElement, fetchData]
}

export default useWeatherAPI