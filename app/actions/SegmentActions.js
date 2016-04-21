'use strict'

import Reflux from 'reflux'

export default Reflux.createActions({
  'addSegment': { children: [ 'completed', 'failed' ] },
  'editSegment': { children: [ 'completed', 'failed' ] },
  'deleteSegment': { children: [ 'completed', 'failed' ] },
  'getSegment': { children: [ 'completed', 'failed' ] },
  'getSegments': { children: [ 'completed', 'failed' ] },
  'listSegments': { children: [ 'completed', 'failed' ] }
})
