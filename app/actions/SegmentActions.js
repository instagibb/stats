'use strict'

import Reflux from 'reflux'

export default Reflux.createActions({
  'getSegment': { children: [ 'completed', 'failed' ] },
  'getSegments': { children: [ 'completed', 'failed' ] },
  'listSegments': { children: [ 'completed', 'failed' ] }
})
