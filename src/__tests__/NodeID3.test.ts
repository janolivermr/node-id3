import { NodeID3, Tags, Chapter } from '../index';
import * as fs from 'fs';
import * as path from 'path';

const nodeID3 = new NodeID3();

it('is initialised correctly', () => {
    expect(nodeID3).toBeInstanceOf(NodeID3);
});

it('decodes text frames correctly', () => {
    const tags = nodeID3.read(path.join(__dirname, 'sample.mp3'));
    expect(tags.title).toBe('440Hz Sample');
    expect(tags.artist).toBe('Samples');
    expect(tags.performerInfo).toBe('Audio Samples Artist');
    expect(tags.composer).toBe('The Composer');
    expect(tags.album).toBe('Audio Samples');
    expect(tags.trackNumber).toBe('1/2');
    expect(tags.partOfSet).toBe('3/4');
    expect(tags.genre).toBe('13');
    expect(tags.encodingTechnology).toBe('Lavf57.56.101');
    expect(3).toEqual(5);
});

test.todo('image decoding')
test.todo('chapter decoding')
test.todo('writing tags')


// const tags = nodeID3.read(path.join(__dirname, 'sample.mp3'));
// console.log(tags);

// //tags.image is the path to the image (only png/jpeg files allowed)
// const tags: Tags = {
//   title: "Tomorrow",
//   artist: "Kevin Penkin",
//   album: "asdfd",
//   image: "./example/mia_cover.jpg",
//   year: 2017,
//   comment: {
//     language: "eng",
//     text: "some text"
//   },
//   trackNumber: "27",
//   userDefinedText: [{
//     description: "testtt.",
//     value: "ja moin."
//   }, {
//     description: "testtt2.",
//     value: "ja moin2."
//   }, {
//     description: "testtt3.",
//     value: "ja moin3."
//   }],
//   private: [{
//     ownerIdentifier: "AbC",
//     data: "asdoahwdiohawdaw"
//   }, {
//     ownerIdentifier: "AbCSSS",
//     data: Buffer.from([0x01, 0x02, 0x05])
//   }],
//   chapter: [<Chapter>{
//     elementID: "Hey!",
//     startTimeMs: 5000,
//     endTimeMs: 8000,
//     tags: {
//       title: "abcdef",
//       artist: "akshdas"
//     }
//   }, <Chapter>{
//     elementID: "Hey2!",
//     startTimeMs: 225000,
//     endTimeMs: 8465000,
//     tags: {
//       artist: "abcdef222"
//     }
//   }]
// }

// let success = nodeID3.write(tags, "./example/test.mp3");
// console.log(success);

// console.log(nodeID3.read("./example/test.mp3").chapter[0].tags)

/*nodeID3.create(tags, function(frame) {
  console.log(frame)
})*/

//let file = fs.readFileSync("./example/Kevin Penkin - Tomorrow.mp3")
/*nodeID3.update(tags, file, function(err, buffer) {
  console.log(err)
  console.log(buffer)
})*/

//fs.writeFileSync("./example/Kevin Penkin - Tomorrow.mp3", nodeID3.update(tags, file))

//console.log(nodeID3.read("./example/example.mp3"))

//async

/*nodeID3.write(tags, "./example/Kevin Penkin - Tomorrow.mp3", function(err) {
  console.log(err)
})
*/

//console.log(nodeID3.read("./example/Kevin Penkin - Tomorrow.mp3"))


/*console.log("READING\n\n")
nodeID3.read("./example/Kevin Penkin - Tomorrow.mp3", function(err, tags) {
  console.log(err)
  console.log(tags)

  console.log("REMOVING\n\n")
  nodeID3.removeTags("./example/Kevin Penkin - Tomorrow.mp3", function(err) {
    console.log("READING\n\n")
    nodeID3.read("./example/Kevin Penkin - Tomorrow.mp3", function(err, tags) {
      console.log(err)
      console.log(tags)
    })
  })

})
*/

/*nodeID3.update({
  TXXX: [{
    description: "testtt.",
    value: "value4."
  }, {
    description: "testtt2.",
    value: "value6."
  },]
}, "./example/example.mp3", (err) => {
  console.log(nodeID3.read("./example/example.mp3"))
})*/

/*console.log(nodeID3.update({
  TXXX: [{
    description: "testtt.",
    value: "value4."
  }, {
    description: "testtt2.",
    value: "value6."
  },]
}, "./example/example.mp3"));

console.log(nodeID3.read("./example/example.mp3"))*/