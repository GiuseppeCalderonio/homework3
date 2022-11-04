import React from 'react'
import { TagCloud } from 'react-tagcloud'


function RequestChart({ requests }) {
  let allwords = requests.map(elt => elt.ldescription).join(" ")
  const wordfreqs = allwords.split(/\s+/).reduce(function (map, word) {
    map[word] = (map[word] || 0) + 1;
    return map;
  }, Object.create(null));
  const wordFreqArray = Object.entries(wordfreqs).map(elt => ({ value: elt[0], count: elt[1] }))
  console.log(wordFreqArray);
  return (
    <div className="form-contain">
      <TagCloud minSize={24}
        maxSize={48}
        tags={wordFreqArray}
        colorOptions={{luminosity: 'dark'}}
        className="simple-cloud"
        randomSeed={484}
      />  </div>
  )
}

export default RequestChart