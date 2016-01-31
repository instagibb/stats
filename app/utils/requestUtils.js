'use strict'

import axios from 'axios'
import _ from 'lodash'


export const requestBuilder = (config) => {
  const defaultConfig = {
    method: 'get',
    baseURL: 'http://localhost:8001'
  }

  return axios(_.defaults(config, defaultConfig))
}

export const doRequest = (req, success, failure) => {
  req.then((response) => {
    if(response.data) {
      success(response.data)
    }
  }).catch((response) => {
    console.log(response)
    if(failure) {
      failure(response)
    }
  })
}
