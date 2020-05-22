import fs = require('fs')
import iconv = require("iconv-lite")

export interface DescribedFrame {
    name: string;
    body: Buffer;
}

export interface AttachedPicture {
    mime: string; /** See https://en.wikipedia.org/wiki/ID3#ID3v2_embedded_image_extension */
    type: {
        id: number;
        name: string;
    };
    description?: string;
    imageBuffer: Buffer;
}

export interface Chapter {
    startTimeMs: number;
    endTimeMs:   number;
    startOffsetBytes?: number;
    endOffsetBytes?: number;
    tags: object;
}

export interface Comment {
    language: string; /** (3 characters) */
    text: string;
    shortText: string;
}

export interface ImageFrame {
    mime: string;
    /**
     * See https://en.wikipedia.org/wiki/ID3#ID3v2_embedded_image_extension
     */
    type: {
       id: number;
       name: string;
    };
    description: string;
    imageBuffer: Buffer;
 }

export interface Popularimeter {
    email: string;
    rating: number; /** 1-255 */
    counter: number;
}

export interface PrivateFrame {
    ownerIdentifier: string;
    data: Buffer | string;
}

export interface UnsynchronisedLyrics {
    language: string; /** (3 characters) */
    text: string;
    shortText: string;
}

export interface UserDefinedText {
    description: string;
    value: string;
}

export interface Tags {
    raw?: object;
    /**
     * The 'Album/Movie/Show title' frame is intended for the title of the recording(/source of sound) which the audio in the file is taken from. 
     */
    album?: string,
    /**
     * The 'BPM' frame contains the number of beats per minute in the mainpart of the audio. The BPM is an integer and represented as a numerical string. 
     */
    bpm?: number,
    /**
     *  The 'Composer(s)' frame is intended for the name of the composer(s). They are seperated with the "/" character. 
     */
    composer?: string,
    /**
     * The 'Content type', which previously was stored as a one byte numeric value only, is now a numeric string. You may use one or several of the types as ID3v1.1 did or, since the category list would be impossible to maintain with accurate and up to date categories, define your own.
     * 
     * References to the ID3v1 genres can be made by, as first byte, enter "(" followed by a number from the genres list (appendix A) and ended with a ")" character. This is optionally followed by a refinement, e.g. "(21)" or "(4)Eurodisco". Several references can be made in the same frame, e.g. "(51)(39)". If the refinement should begin with a "(" character it should be replaced with "((", e.g. "((I can figure out any genre)" or "(55)((I think...)"
     */
    genre?: string,
    /**
     * The 'Copyright message' frame, which must begin with a year and a space character (making five characters), is intended for the copyright holder of the original sound, not the audio file itself. The absence of this frame means only that the copyright information is unavailable or has been removed, and must not be interpreted to mean that the sound is public domain. Every time this field is displayed the field must be preceded with "Copyright © ". 
     */
    copyright?: string,
    /**
     * The 'Date' frame is a numeric string in the DDMM format containing the date for the recording. This field is always four characters long. 
     */
    date?: string,
    /**
     * The 'Playlist delay' defines the numbers of milliseconds of silence between every song in a playlist. The player should use the "ETC" frame, if present, to skip initial silence and silence at the end of the audio to match the 'Playlist delay' time. The time is represented as a numeric string. 
     */
    playlistDelay?: number,
    /**
     * The 'Encoded by' frame contains the name of the person or organisation that encoded the audio file. This field may contain a copyright message, if the audio file also is copyrighted by the encoder. 
     */
    encodedBy?: string,
    /**
     * The 'Lyricist(s)/Text writer(s)' frame is intended for the writer(s) of the text or lyrics in the recording. They are seperated with the "/" character. 
     */
    textWriter?: string,
    /**
     * The 'File type' frame indicates which type of audio this tag defines. The following type and refinements are defined:
     * 
     * MPG       MPEG Audio
     * /1        MPEG 1/2 layer I
     * /2        MPEG 1/2 layer II
     * /3        MPEG 1/2 layer III
     * /2.5      MPEG 2.5
     *  /AAC     Advanced audio compression
     * VQF       Transform-domain Weighted Interleave Vector Quantization
     * PCM       Pulse Code Modulated audio
     * 
     * but other types may be used, not for these types though. This is used in a similar way to the predefined types in the "Media type" frame, but without parentheses. If this frame is not present audio type is assumed to be "MPG". 
     */
    fileType?: string,
    /**
     * The 'Time' frame is a numeric string in the HHMM format containing the time for the recording. This field is always four characters long. 
     */
    time?: string,
    /**
     * The 'Content group description' frame is used if the sound belongs to a larger category of sounds/music. For example, classical music is often sorted in different musical sections (e.g. "Piano Concerto", "Weather - Hurricane"). 
     */
    contentGroup?: string,
    /**
     * The 'Title/Songname/Content description' frame is the actual name of the piece (e.g. "Adagio", "Hurricane Donna"). 
     */
    title?: string,
    /**
     * The 'Subtitle/Description refinement' frame is used for information directly related to the contents title (e.g. "Op. 16" or "Performed live at Wembley"). 
     */
    subtitle?: string,
    /**
     * The 'Initial key' frame contains the musical key in which the sound starts. It is represented as a string with a maximum length of three characters. The ground keys are represented with "A","B","C","D","E", "F" and "G" and halfkeys represented with "b" and "#". Minor is represented as "m". Example "Cbm". Off key is represented with an "o" only. 
     */
    initialKey?: string,
    /**
     * The 'Language(s)' frame should contain the languages of the text or lyrics spoken or sung in the audio. The language is represented with three characters according to ISO-639-2. If more than one language is used in the text their language codes should follow according to their usage. 
     */
    language?: string,
    /**
     * The 'Length' frame contains the length of the audiofile in milliseconds, represented as a numeric string. 
     */
    length?: number,
    /**
     * The 'Media type' frame describes from which media the sound originated. This may be a text string or a reference to the predefined media types found in the list below. References are made within "(" and ")" and are optionally followed by a text refinement, e.g. "(MC) with four channels". If a text refinement should begin with a "(" character it should be replaced with "((". Predefined refinements is appended after the media type, e.g. "(CD/A)" or "(VID/PAL/VHS)".
     *
     * DIG     Other digital media
     *    /A  Analog transfer from media
     *
     * ANA     Other analog media
     *   /WAC Wax cylinder
     *   /8CA 8-track tape cassette
     *
     * CD      CD
     *     /A Analog transfer from media
     *    /DD DDD
     *    /AD ADD
     *    /AA AAD
     *
     * LD      Laserdisc
     *     /A Analog transfer from media
     *
     * TT      Turntable records
     *    /33 33.33 rpm
     *    /45 45 rpm
     *    /71 71.29 rpm
     *    /76 76.59 rpm
     *    /78 78.26 rpm
     *    /80 80 rpm
     *
     * MD      MiniDisc
     *     /A Analog transfer from media
     *
     * DAT     DAT
     *     /A Analog transfer from media
     *     /1 standard, 48 kHz/16 bits, linear
     *     /2 mode 2, 32 kHz/16 bits, linear
     *     /3 mode 3, 32 kHz/12 bits, nonlinear, low speed
     *     /4 mode 4, 32 kHz/12 bits, 4 channels
     *     /5 mode 5, 44.1 kHz/16 bits, linear
     *     /6 mode 6, 44.1 kHz/16 bits, 'wide track' play
     *
     * DCC     DCC
     *     /A Analog transfer from media
     *
     * DVD     DVD
     *     /A Analog transfer from media
     *
     * TV      Television
     *   /PAL PAL
     *  /NTSC NTSC
     * /SECAM SECAM
     *
     * VID     Video
     *   /PAL PAL
     *  /NTSC NTSC
     * /SECAM SECAM
     *   /VHS VHS
     *  /SVHS S-VHS
     *  /BETA BETAMAX
     *
     * RAD     Radio
     *    /FM FM
     *    /AM AM
     *    /LW LW
     *    /MW MW
     *
     * TEL     Telephone
     *     /I ISDN
     *
     * MC      MC (normal cassette)
     *     /4 4.75 cm/s (normal speed for a two sided cassette)
     *     /9 9.5 cm/s
     *     /I Type I cassette (ferric/normal)
     *    /II Type II cassette (chrome)
     *   /III Type III cassette (ferric chrome)
     *    /IV Type IV cassette (metal)
     *
     * REE     Reel
     *     /9 9.5 cm/s
     *    /19 19 cm/s
     *    /38 38 cm/s
     *    /76 76 cm/s
     *     /I Type I cassette (ferric/normal)
     *    /II Type II cassette (chrome)
     *   /III Type III cassette (ferric chrome)
     *    /IV Type IV cassette (metal)
     */
    mediaType?: string,
    /**
     * The 'Original album/movie/show title' frame is intended for the title of the original recording (or source of sound), if for example the music in the file should be a cover of a previously released song. 
     */
    originalTitle?: string,
    /**
     * The 'Original filename' frame contains the preferred filename for the file, since some media doesn't allow the desired length of the filename. The filename is case sensitive and includes its suffix. 
     */
    originalFilename?: string,
    /**
     * The 'Original lyricist(s)/text writer(s)' frame is intended for the text writer(s) of the original recording, if for example the music in the file should be a cover of a previously released song. The text writers are seperated with the "/" character. 
     */
    originalTextwriter?: string,
    /**
     * The 'Original artist(s)/performer(s)' frame is intended for the performer(s) of the original recording, if for example the music in the file should be a cover of a previously released song. The performers are seperated with the "/" character. 
     */
    originalArtist?: string,
    /**
     * The 'Original release year' frame is intended for the year when the original recording, if for example the music in the file should be a cover of a previously released song, was released. The field is formatted as in the "Year" frame. 
     */
    originalYear?: number,
    /**
     * The 'File owner/licensee' frame contains the name of the owner or licensee of the file and it's contents. 
     */
    fileOwner?: string,
    /**
     * The 'Lead artist(s)/Lead performer(s)/Soloist(s)/Performing group' is used for the main artist(s). They are seperated with the "/" character. 
     */
    artist?: string,
    /**
     * The 'Band/Orchestra/Accompaniment' frame is used for additional information about the performers in the recording. 
     */
    performerInfo?: string,
    /**
     * The 'Conductor' frame is used for the name of the conductor. 
     */
    conductor?: string,
    /**
     * The 'Interpreted, remixed, or otherwise modified by' frame contains more information about the people behind a remix and similar interpretations of another existing piece. 
     */
    remixArtist?: string,
    /**
     * The 'Part of a set' frame is a numeric string that describes which part of a set the audio came from. This frame is used if the source described in the "Album/Movie/Show title" frame is divided into several mediums, e.g. a double CD. The value may be extended with a "/" character and a numeric string containing the total number of parts in the set. E.g. "1/2". 
     */
    partOfSet?: string,
    /**
     * The 'Publisher' frame simply contains the name of the label or publisher. 
     */
    publisher?: string,
    /**
     * The 'Track number/Position in set' frame is a numeric string containing the order number of the audio-file on its original recording. This may be extended with a "/" character and a numeric string containing the total numer of tracks/elements on the original recording. E.g. "4/9". 
     */
    trackNumber?: string,
    /**
     * The 'Recording dates' frame is a intended to be used as complement to the "Year", "Date" and "Time" frames. E.g. "4th-7th June, 12th June" in combination with the "Year" frame. 
     */
    recordingDates?: string,
    /**
     * The 'Internet radio station name' frame contains the name of the internet radio station from which the audio is streamed. 
     */
    internetRadioName?: string,
    /**
     * The 'Internet radio station owner' frame contains the name of the owner of the internet radio station from which the audio is streamed. 
     */
    internetRadioOwner?: string,
    /**
     * The 'Size' frame contains the size of the audiofile in bytes, excluding the ID3v2 tag, represented as a numeric string. 
     */
    size?: number,
    /**
     * The 'ISRC' frame should contain the International Standard Recording Code (ISRC) (12 characters). 
     */
    ISRC?: string,
    /**
     * The 'Software/Hardware and settings used for encoding' frame includes the used audio encoder and its settings when the file was encoded. Hardware refers to hardware encoders, not the computer on which a program was run. 
     */
    encodingTechnology?: string,
    /**
     * The 'Year' frame is a numeric string with a year of the recording. This frames is always four characters long (until the year 10000). 
     */
    year?: number,
    comment?: {
       language: string,
       text: string,
    },
    unsynchronisedLyrics?: {
       language: string,
       text: string
    }
    userDefinedText?: UserDefinedText[],
    chapter?: Chapter[],
    image?: ImageFrame | string,
    popularimeter?: {
       email: string,
       /**
        * 1-255
        */
       rating: number,
       counter: number,
    },
    private?: PrivateFrame[]
 }


/*
**  Used specification: http://id3.org/id3v2.3.0
*/

/*
**  List of official text information frames
**  LibraryName: "T***"
**  Value is the ID of the text frame specified in the link above, the object's keys are just for simplicity, you can also use the ID directly.
*/
const TFrames: { [id: string]: string } = {
    album:              "TALB",
    bpm:                "TBPM",
    composer:           "TCOM",
    genre:              "TCON",
    copyright:          "TCOP",
    date:               "TDAT",
    playlistDelay:      "TDLY",
    encodedBy:          "TENC",
    textWriter:         "TEXT",
    fileType:           "TFLT",
    time:               "TIME",
    contentGroup:       "TIT1",
    title:              "TIT2",
    subtitle:           "TIT3",
    initialKey:         "TKEY",
    language:           "TLAN",
    length:             "TLEN",
    mediaType:          "TMED",
    originalTitle:      "TOAL",
    originalFilename:   "TOFN",
    originalTextwriter: "TOLY",
    originalArtist:     "TOPE",
    originalYear:       "TORY",
    fileOwner:          "TOWN",
    artist:             "TPE1",
    performerInfo:      "TPE2",
    conductor:          "TPE3",
    remixArtist:        "TPE4",
    partOfSet:          "TPOS",
    publisher:          "TPUB",
    trackNumber:        "TRCK",
    recordingDates:     "TRDA",
    internetRadioName:  "TRSN",
    internetRadioOwner: "TRSO",
    size:               "TSIZ",
    ISRC:               "TSRC",
    encodingTechnology: "TSSE",
    year:               "TYER"
}

const TFramesV220: { [id: string]: string } =  {
    album:              "TAL",
    bpm:                "TBP",
    composer:           "TCM",
    genre:              "TCO",
    copyright:          "TCR",
    date:               "TDA",
    playlistDelay:      "TDY",
    encodedBy:          "TEN",
    textWriter:         "TEXT",
    fileType:           "TFT",
    time:               "TIM",
    contentGroup:       "TT1",
    title:              "TT2",
    subtitle:           "TT3",
    initialKey:         "TKE",
    language:           "TLA",
    length:             "TLE",
    mediaType:          "TMT",
    originalTitle:      "TOT",
    originalFilename:   "TOF",
    originalTextwriter: "TOL",
    originalArtist:     "TOA",
    originalYear:       "TOR",
    artist:             "TP1",
    performerInfo:      "TP2",
    conductor:          "TP3",
    remixArtist:        "TP4",
    partOfSet:          "TPA",
    publisher:          "TPB",
    trackNumber:        "TRK",
    recordingDates:     "TRD",
    size:               "TSI",
    ISRC:               "TRC",
    encodingTechnology: "TSS",
    year:               "TYE"
}

interface SFrame {
    create: string;
    read: string;
    name: string;
    multiple?: boolean;
    updateCompareKey?: string;
}
/*
**  List of non-text frames which follow their specific specification
**  name    => Frame ID
**  create  => function to create the frame
**  read    => function to read the frame
*/
const SFrames: { [id: string]: SFrame } = {
    'comment': {
        create: "createCommentFrame",
        read: "readCommentFrame",
        name: "COMM"
    },
    'image': {
        create: "createPictureFrame",
        read: "readPictureFrame",
        name: "APIC"
    },
    'unsynchronisedLyrics': {
        create: "createUnsynchronisedLyricsFrame",
        read: "readUnsynchronisedLyricsFrame",
        name: "USLT"
    },
    'userDefinedText': {
        create: "createUserDefinedText",
        read: "readUserDefinedText",
        name: "TXXX",
        multiple: true,
        updateCompareKey: "description"
    },
    'popularimeter': {
        create: "createPopularimeterFrame",
        read: "readPopularimeterFrame",
        name: "POPM"
    },
    'private': {
        create: "createPrivateFrame",
        read: "readPrivateFrame",
        name: "PRIV",
        multiple: true
    },
    'chapter': {
        create: "createChapterFrame",
        read: "readChapterFrame",
        name: "CHAP",
        multiple: true
    }
}

const SFramesV220: { [id: string]: SFrame } = {
    'image': {
        create: "createPictureFrame",
        read: "readPictureFrame",
        name: "PIC"
    }
}

/*
**  Officially available types of the picture frame
*/
const APICTypes = [
	"other",
	"file icon",
	"other file icon",
	"front cover",
	"back cover",
	"leaflet page",
	"media",
	"lead artist",
	"artist",
	"conductor",
	"band",
	"composer",
	"lyricist",
	"recording location",
	"during recording",
	"during performance",
	"video screen capture",
	"a bright coloured fish",
	"illustration",
	"band logotype",
	"publisher logotype"
]

export class NodeID3 {

/*
**  Write passed tags to a file/buffer @ filebuffer
**  tags        => Object
**  filebuffer  => String || Buffer
**  fn          => Function (for asynchronous usage)
*/
public write(tags: Tags, filebuffer: string | Buffer, fn?: (err: NodeJS.ErrnoException | Error | null, buffer?: Buffer) => void) {
    const completeTag = this.create(tags)
    if(filebuffer instanceof Buffer) {
        filebuffer = this.removeTagsFromBuffer(filebuffer) || filebuffer
        const completeBuffer = Buffer.concat([completeTag!, filebuffer])
        if(fn && typeof fn === 'function') {
            fn(null, completeBuffer)
            return
        } else {
            return completeBuffer
        }
    }

    if(fn && typeof fn === 'function') {
        try {
            fs.readFile(filebuffer, (err: NodeJS.ErrnoException | null, data: Buffer) => {
                if(err) {
                    fn(err)
                    return
                }
                data = this.removeTagsFromBuffer(data) || data
                const rewriteFile = Buffer.concat([completeTag!, data])
                fs.writeFile(filebuffer, rewriteFile, 'binary', (writeErr) => {
                    fn(writeErr)
                })
            })
        } catch(err) {
            fn(err)
        }
    } else {
        try {
            let data = fs.readFileSync(filebuffer)
            data = this.removeTagsFromBuffer(data) || data
            const rewriteFile = Buffer.concat([completeTag!, data])
            fs.writeFileSync(filebuffer, rewriteFile, 'binary')
            return true
        } catch(err) {
            return err
        }
    }
}

public create(tags: Tags, fn?: (buffer: Buffer) => void) {
    let frames = []

    //  Push a header for the ID3-Frame
    frames.push(this.createTagHeader())

    frames = frames.concat(this.createBuffersFromTags(tags))

    //  Calculate frame size of ID3 body to insert into header

    let totalSize = 0
    frames.forEach((frame) => {
        totalSize += frame.length
    })

    //  Don't count ID3 header itself
    totalSize -= 10
    //  ID3 header size uses only 7 bits of a byte, bit shift is needed
    const size = this.encodeSize(totalSize)

    //  Write bytes to ID3 frame header, which is the first frame
    frames[0].writeUInt8(size[0], 6)
    frames[0].writeUInt8(size[1], 7)
    frames[0].writeUInt8(size[2], 8)
    frames[0].writeUInt8(size[3], 9)

    if(fn && typeof fn === 'function') {
        fn(Buffer.concat(frames))
    } else {
        return Buffer.concat(frames)
    }
}

protected createBuffersFromTags(tags: { [id: string]: any}) {
    const frames: Buffer[] = []
    const tagNames = Object.keys(tags)

    tagNames.forEach(tag => {
        //  Check if passed tag is text frame (Alias or ID)
        let frame
        if (TFrames[tag] || Object.keys(TFrames).map(i => TFrames[i]).indexOf(tag) !== -1) {
            const specName = TFrames[tag] || tag
            frame = this.createTextFrame(specName, tags[tag])
        } else if (SFrames[tag]) {  //  Check if Alias of special frame
            const createFrameFunction = SFrames[tag].create
            // frame = this[createFrameFunction](tags[tag])
            frame = this.proxyCall(createFrameFunction, tags[tag])
        } else if (Object.keys(SFrames).map(i => SFrames[i]).map(x => x.name).indexOf(tag) !== -1) {  //  Check if ID of special frame
            //  get create function from special frames where tag ID is found at SFrame[index].name
            const createFrameFunction = SFrames[Object.keys(SFrames)[Object.keys(SFrames).map(i => SFrames[i]).map(x => x.name).indexOf(tag)]].create
            // frame = this[createFrameFunction](tags[tag])
            frame = this.proxyCall(createFrameFunction, tags[tag])
        }

        if (frame instanceof Buffer) {
            frames.push(frame)
        }
    })

    return frames
}

/*
**  Read ID3-Tags from passed buffer/filepath
**  filebuffer  => Buffer || String
**  options     => Object
**  fn          => function (for asynchronous usage)
*/
public read(filebuffer: string | Buffer): Tags;
public read(filebuffer: string | Buffer, fn: (err: NodeJS.ErrnoException | null, tags: Tags | null) => void): void
public read(filebuffer: string | Buffer, options?: ((err: NodeJS.ErrnoException | null, data: any) => void) | object, fn?: (err: NodeJS.ErrnoException | null, data: any) => void): Tags | void {
    if (options && typeof options !== 'object' && typeof options === 'function') {
        fn = options;
    }
    if(!options || typeof options === 'function') {
        options = {}
    }
    if(!fn || typeof fn !== 'function') {
        if(typeof filebuffer === "string" || filebuffer instanceof String) {
            filebuffer = fs.readFileSync(filebuffer)
        }
        const tags = this.getTagsFromBuffer(filebuffer, options)
        return tags
    } else if (fn && typeof fn === 'function' && fn === undefined) {
        if(typeof filebuffer === "string" || filebuffer instanceof String) {
            fs.readFile(filebuffer, (err, data) => {
                if(err) {
                    fn!(err, null) // TODO exclamation point
                } else {
                    try {
                        const tags = this.getTagsFromBuffer(data, options)
                        fn!(null, tags) // TODO exclamation point
                    } catch (e) {
                        fn!(e, null)
                    }
                }
            })
        }
    }
}

/*
**  Update ID3-Tags from passed buffer/filepath
**  filebuffer  => Buffer || String
**  tags        => Object
**  fn          => function (for asynchronous usage)
*/
public update(tags: Tags, filebuffer: string | Buffer, fn?: (err: NodeJS.ErrnoException | Error | null, buffer?: Buffer) => void) {
    const rawTags: { [id: string]: any} = {}
    const SRawToNameMap: { [id: string]: any} = {}
    Object.keys(SFrames).map((key, index) => {
        SRawToNameMap[SFrames[key].name] = key
    })
    Object.keys(tags).map((tagKey) => {
        //  if js name passed (TF)
        if(TFrames[tagKey]) {
            rawTags[TFrames[tagKey]] = tags[tagKey as keyof Tags]

        //  if js name passed (SF)
        } else if(SFrames[tagKey]) {
            rawTags[SFrames[tagKey].name] = tags[tagKey as keyof Tags]

        //  if raw name passed (TF)
        } else if(Object.keys(TFrames).map(i => TFrames[i]).indexOf(tagKey) !== -1) {
            rawTags[tagKey] = tags[tagKey as keyof Tags]

        //  if raw name passed (SF)
        } else if(Object.keys(SFrames).map(i => SFrames[i]).map(x => x.name).indexOf(tagKey) !== -1) {
            rawTags[tagKey] = tags[tagKey as keyof Tags]
        }
    })
    if(!fn || typeof fn !== 'function') {
        const currentTagsTags = this.read(filebuffer)
        const currentTags: { [id: string]: any} = currentTagsTags.raw || {}
        //  update current tags with new or keep them
        Object.keys(rawTags).map((tag) => {
            if(SFrames[SRawToNameMap[tag]] && SFrames[SRawToNameMap[tag]].multiple && SFrames[SRawToNameMap[tag]].updateCompareKey && currentTags[tag] && rawTags[tag]) {
                const cCompare: { [id: string]: any} = {}
                currentTags[tag].forEach((cTag: any, index: any) => {
                    cCompare[cTag[SFrames[SRawToNameMap[tag]].updateCompareKey!]] = index // TODO Fix exclamation point
                })
                if(!(rawTags[tag] instanceof Array)) rawTags[tag] = [rawTags[tag]]
                rawTags[tag].forEach((rTag: any, index: any) => {
                    const comparison = cCompare[rTag[SFrames[SRawToNameMap[tag]].updateCompareKey!]] // TODO Fix exclamation point
                    if(comparison !== undefined) {
                        currentTags[tag][comparison] = rTag
                    } else {
                        currentTags[tag].push(rTag)
                    }
                })
            } else {
                currentTags[tag] = rawTags[tag]
            }
        })
        return this.write(currentTags, filebuffer)
    } else {
        this.read(filebuffer, (err: NodeJS.ErrnoException | null, tagsData: Tags | null) => {
            if(err || tagsData === null) {
                fn(err)
                return
            }
            const currentTags: { [id: string]: any} = tagsData.raw || {}
            //  update current tags with new or keep them
            Object.keys(rawTags).map((tag) => {
                if(SFrames[SRawToNameMap[tag]] && SFrames[SRawToNameMap[tag]].multiple && currentTags[tag] && rawTags[tag]) {
                    const cCompare: { [id: string]: any} = {}
                    currentTags[tag].forEach((cTag: any, index: any) => {
                        cCompare[cTag[SFrames[SRawToNameMap[tag]].updateCompareKey!]] = index // TODO Fix exclamation point
                    })
                    if(!(rawTags[tag] instanceof Array)) rawTags[tag] = [rawTags[tag]]
                    rawTags[tag].forEach((rTag: any, index: any) => {
                        const comparison = cCompare[rTag[SFrames[SRawToNameMap[tag]].updateCompareKey!]] // TODO Fix exclamation point
                        if(comparison !== undefined) {
                            currentTags[tag][comparison] = rTag
                        } else {
                            currentTags[tag].push(rTag)
                        }
                    })
                } else {
                    currentTags[tag] = rawTags[tag]
                }
            })
            this.write(currentTags, filebuffer, fn)
        })
    }
}

/*
**  Read ID3-Tags from passed buffer
**  filebuffer  => Buffer
**  options     => Object
*/
protected getTagsFromBuffer(filebuffer: Buffer, options: any): Tags {
    const framePosition = this.getFramePosition(filebuffer)
    if(framePosition === -1) {
        throw new Error('Could not find ID3 Frame'); // TODO improve error text
    }
    const frameSize = this.getTagSize(Buffer.from(filebuffer.toString('hex', framePosition, framePosition + 10), "hex")) + 10
    const ID3Frame = Buffer.alloc(frameSize + 1)
    const ID3FrameBody = Buffer.alloc(frameSize - 10 + 1)
    filebuffer.copy(ID3Frame, 0, framePosition)
    filebuffer.copy(ID3FrameBody, 0, framePosition + 10)

    // ID3 version e.g. 3 if ID3v2.3.0
    const ID3Version = ID3Frame[3]
    let identifierSize = 4
    let textframeHeaderSize = 10
    if(ID3Version === 2) {
        identifierSize = 3
        textframeHeaderSize = 6
    }

    const frames = this.getFramesFromID3Body(ID3FrameBody, ID3Version, identifierSize, textframeHeaderSize)

    return this.getTagsFromFrames(frames, ID3Version)
}

protected getFramesFromID3Body(ID3FrameBody: Buffer, ID3Version: number, identifierSize: number, textframeHeaderSize: number): DescribedFrame[] {
    let currentPosition = 0
    const frames: DescribedFrame[] = []
    while(currentPosition < ID3FrameBody.length && ID3FrameBody[currentPosition] !== 0x00) {
        const bodyFrameHeader = Buffer.alloc(textframeHeaderSize)
        ID3FrameBody.copy(bodyFrameHeader, 0, currentPosition)

        let decodeSize = false
        if(ID3Version === 4) {
            decodeSize = true
        }
        const bodyFrameSize = this.getFrameSize(bodyFrameHeader, decodeSize, ID3Version)
        if(bodyFrameSize > (ID3FrameBody.length - currentPosition)) {
            break
        }
        const bodyFrameBuffer = Buffer.alloc(bodyFrameSize)
        ID3FrameBody.copy(bodyFrameBuffer, 0, currentPosition + textframeHeaderSize)
        //  Size of sub frame + its header
        currentPosition += bodyFrameSize + textframeHeaderSize
        frames.push({
            name: bodyFrameHeader.toString('utf8', 0, identifierSize),
            body: bodyFrameBuffer
        })
    }

    return frames
}

protected getTagsFromFrames(frames: DescribedFrame[], ID3Version: number) {
    const tags: any = { raw: {} }

    frames.forEach((frame: DescribedFrame) => {
        //  Check first character if frame is text frame
        if(frame.name[0] === "T" && frame.name !== "TXXX") {
            //  Decode body
            let decoded: string;
            if(frame.body[0] === 0x01) {
                decoded = iconv.decode(frame.body.slice(1), "utf16").replace(/\0/g, "")
            } else {
                decoded = iconv.decode(frame.body.slice(1), "ISO-8859-1").replace(/\0/g, "")
            }
            tags.raw[frame.name] = decoded
            const versionFrames = ID3Version === 2 ? TFramesV220 : TFrames;
            Object.keys(versionFrames).map((key) => {
                if(versionFrames[key] === frame.name) {
                    tags[key] = decoded
                }
            })
        } else {
            const versionFrames = ID3Version === 2 ? SFramesV220 : SFrames;
            //  Check if non-text frame is supported
            Object.keys(versionFrames).map((key: string) => {
                if(versionFrames[key].name === frame.name) {
                    // let decoded = this[versionFrames[key].read](frame.body, ID3Version)
                    const decoded = this.proxyCall(versionFrames[key].read, frame.body, ID3Version) 
                    if(versionFrames[key].multiple) {
                        if(!tags[key]) tags[key] = []
                        if(!tags.raw[frame.name]) tags.raw[frame.name] = []
                        tags.raw[frame.name].push(decoded)
                        tags[key].push(decoded)
                    } else {
                        tags.raw[frame.name] = decoded
                        tags[key] = decoded
                    }
                }
            })
        }
    })

    return tags
}

/*
**  Get position of ID3-Frame, returns -1 if not found
**  buffer  => Buffer
*/
protected getFramePosition(buffer: Buffer) {
    const framePosition = buffer.indexOf("ID3")
    if(framePosition === -1 || framePosition > 20) {
        return -1
    } else {
        return framePosition
    }
}

/*
**  Get size of tag from header
**  buffer  => Buffer/Array (header)
*/
protected getTagSize(buffer: Buffer) {
    return this.decodeSize(Buffer.from([buffer[6], buffer[7], buffer[8], buffer[9]]))
}

/*
**  Get size of frame from header
**  buffer  => Buffer/Array (header)
**  decode  => Boolean
*/
protected getFrameSize(buffer: Buffer, decode: boolean, ID3Version: number) {
    let decodeBytes
    if(ID3Version > 2) {
        decodeBytes = [buffer[4], buffer[5], buffer[6], buffer[7]]
    } else {
        decodeBytes = [buffer[3], buffer[4], buffer[5]]
    }
    if(decode) {
        return this.decodeSize(Buffer.from(decodeBytes))
    } else {
        return Buffer.from(decodeBytes).readUIntBE(0, decodeBytes.length)
    }
}

/*
**  Checks and removes already written ID3-Frames from a buffer
**  data => buffer
*/
protected removeTagsFromBuffer(data: Buffer) {
    const framePosition = this.getFramePosition(data)

    if(framePosition === -1) {
        return data
    }

    const hSize = Buffer.from([data[framePosition + 6], data[framePosition + 7], data[framePosition + 8], data[framePosition + 9]])

    // tslint:disable-next-line: no-bitwise
    if ((hSize[0] | hSize[1] | hSize[2] | hSize[3]) & 0x80) {
        //  Invalid tag size (msb not 0)
        return false
    }

    const size = this.decodeSize(hSize)
    return data.slice(framePosition + size + 10)
}

/*
**  Checks and removes already written ID3-Frames from a file
**  data => buffer
*/
protected removeTags(filepath: string, fn?: (err: NodeJS.ErrnoException | null) => void) {
    if(!fn || typeof fn !== 'function') {
        let data
        try {
            data = fs.readFileSync(filepath)
        } catch(e) {
            return e
        }

        const newData = this.removeTagsFromBuffer(data)
        if(!newData) {
            return false
        }

        try {
            fs.writeFileSync(filepath, newData, 'binary')
        } catch(e) {
            return e
        }

        return true
    } else {
        fs.readFile(filepath, (err: NodeJS.ErrnoException | null, data: Buffer) => {
            if(err) {
                fn(err)
            }

            const newData = this.removeTagsFromBuffer(data)
            if(!newData) {
                fn(err)
                return
            }

            fs.writeFile(filepath, newData, 'binary', (writeErr) => {
                if(writeErr) {
                    fn(writeErr)
                } else {
                    fn(null)
                }
            })
        })
    }
}

/*
**  This function ensures that the msb of each byte is 0
**  totalSize => int
*/
protected encodeSize(totalSize: number) {
    // tslint:disable: no-bitwise
    const byte3 = totalSize & 0x7F
    const byte2 = (totalSize >> 7) & 0x7F
    const byte1 = (totalSize >> 14) & 0x7F
    const byte0 = (totalSize >> 21) & 0x7F
    // tslint:enable: no-bitwise
    return ([byte0, byte1, byte2, byte3])
}


/*
**  This function decodes the 7-bit size structure
**  hSize => int
*/
protected decodeSize(hSize: Buffer): number {
    // tslint:disable-next-line: no-bitwise
    return ((hSize[0] << 21) + (hSize[1] << 14) + (hSize[2] << 7) + (hSize[3]))
}

/*
**  Create header for ID3-Frame v2.3.0
*/
protected createTagHeader() {
    const header = Buffer.alloc(10)
    header.fill(0)
    header.write("ID3", 0)              // File identifier
    header.writeUInt16BE(0x0300, 3)     // Version 2.3.0  --  03 00
    header.writeUInt16BE(0x0000, 5)     // Flags 00

    // Last 4 bytes are used for header size, but have to be inserted later, because at this point, its size is not clear.

    return header
}

/*
** Create text frame
** specName =>  string (ID)
** text     =>  string (body)
*/
protected createTextFrame(specName: string, text: string) {
    if(!specName || !text) {
        return null
    }

    const encoded = iconv.encode(text, "utf16")

    const buffer = Buffer.alloc(10)
    buffer.fill(0)
    buffer.write(specName, 0)                           //  ID of the specified frame
    buffer.writeUInt32BE((encoded).length + 1, 4)       //  Size of frame (string length + encoding byte)
    const encBuffer = Buffer.alloc(1)                       //  Encoding (now using UTF-16 encoded w/ BOM)
    encBuffer.fill(1)                                   //  UTF-16

    // var contentBuffer = Buffer.from(encoded, 'binary')   //  Text -> Binary encoding for UTF-16 w/ BOM
    // return Buffer.concat([buffer, encBuffer, contentBuffer])
    return Buffer.concat([buffer, encBuffer, encoded]);
}

/*
**  data => string || buffer
*/
protected createPictureFrame(data: string | ImageFrame | Buffer) {
    try {
        let apicData: Buffer;
        if (typeof data === 'string') {
            apicData = Buffer.from(fs.readFileSync(data, 'binary'), 'binary');
        } else {
            if (!(data instanceof Buffer)) {
                data = data.imageBuffer;
            }
            apicData = Buffer.from(data);
        }
        const bHeader = Buffer.alloc(10)
        bHeader.fill(0)
        bHeader.write("APIC", 0)

    	let mimeType = "image/png"

        if(apicData[0] === 0xff && apicData[1] === 0xd8 && apicData[2] === 0xff) {
            mimeType = "image/jpeg"
        }

        const bContent = Buffer.alloc(mimeType.length + 4)
        bContent.fill(0)
        bContent[mimeType.length + 2] = 0x03                           //  Front cover
        bContent.write(mimeType, 1)

    	bHeader.writeUInt32BE(apicData.length + bContent.length, 4)     //  Size of frame

        return Buffer.concat([bHeader, bContent, apicData])
    } catch(e) {
        return e
    }
}

/*
**  data => buffer
*/
protected readPictureFrame(APICFrame: Buffer, ID3Version: number) {
    const picture = {} as AttachedPicture

    let APICMimeType
    if(ID3Version === 2) {
        APICMimeType = APICFrame.toString('ascii').substring(1, 4)
    } else {
        APICMimeType = APICFrame.toString('ascii').substring(1, APICFrame.indexOf(0x00, 1))
    }

    if(APICMimeType === "image/jpeg") {
        picture.mime = "jpeg"
    } else if(APICMimeType === "image/png") {
        picture.mime = "png"
    } else {
        picture.mime = APICMimeType
    }

    if(ID3Version === 2 && APICTypes.length < APICFrame[4]) {
        picture.type = {
            id: APICFrame[4],
            name: APICTypes[APICFrame[4]]
        }
    } else {
        picture.type = {
            id: APICFrame[APICFrame.indexOf(0x00, 1) + 1],
            name: APICTypes[APICFrame[APICFrame.indexOf(0x00, 1) + 1]]
        }
    }

    let descEnd
    if(APICFrame[0] === 0x00) {
        if(ID3Version === 2) {
            picture.description = iconv.decode(APICFrame.slice(5, APICFrame.indexOf(0x00, 5)), "ISO-8859-1") || undefined
            descEnd = APICFrame.indexOf(0x00, 5)
        } else {
            picture.description = iconv.decode(APICFrame.slice(APICFrame.indexOf(0x00, 1) + 2, APICFrame.indexOf(0x00, APICFrame.indexOf(0x00, 1) + 2)), "ISO-8859-1") || undefined
            descEnd = APICFrame.indexOf(0x00, APICFrame.indexOf(0x00, 1) + 2)
        }
    } else if (APICFrame[0] === 0x01) {
        if(ID3Version === 2) {
            const descOffset = 5
            const desc = APICFrame.slice(descOffset)
            const descFound = desc.indexOf("0000", 0, 'hex')
            descEnd = descOffset + descFound + 2

            if(descFound !== -1) {
                picture.description = iconv.decode(desc.slice(0, descFound + 2), 'utf16') || undefined
            }
        } else {
            const descOffset = APICFrame.indexOf(0x00, 1) + 2
            const desc = APICFrame.slice(descOffset)
            const descFound = desc.indexOf("0000", 0, 'hex')
            descEnd = descOffset + descFound + 2

            if(descFound !== -1) {
                picture.description = iconv.decode(desc.slice(0, descFound + 2), 'utf16') || undefined
            }
        }
    }
    if(descEnd) {
        picture.imageBuffer = APICFrame.slice(descEnd + 1)
    } else {
        picture.imageBuffer = APICFrame.slice(5)
    }

    return picture
}

protected getEncodingByte(encoding?: string | number) {
    if(!encoding || encoding === 0x00 || encoding === "ISO-8859-1") {
        return 0x00
    } else {
        return 0x01
    }
}

protected getEncodingName(encoding?: string | number) {
    if(this.getEncodingByte(encoding) === 0x00) {
        return "ISO-8859-1"
    } else {
        return "utf16"
    }
}

protected getTerminationCount(encoding?: string| number) {
    if(encoding === 0x00) {
        return 1
    } else {
        return 2
    }
}

protected createTextEncoding(encoding?: string | number) {
    const buffer = Buffer.alloc(1)
    buffer[0] = this.getEncodingByte(encoding)
    return buffer
}

protected createLanguage(language?: string) {
    if(!language) {
        language = "eng"
    } else if(language.length > 3) {
        language = language.substring(0, 3)
    }

    return Buffer.from(language)
}

protected createContentDescriptor(description: string, encoding: string | number, terminated: boolean) {
    if(!description) {
        return terminated ? iconv.encode("\0", this.getEncodingName(encoding)) : Buffer.alloc(0)
    }

    const encoded = iconv.encode(description, this.getEncodingName(encoding))

    return terminated ? Buffer.concat([encoded, Buffer.alloc(this.getTerminationCount(encoding), 0x00)]) : encoded
}

protected createText(text: string, encoding: string | number, terminated: boolean) {
    if(!text) {
        text = ""
    }

    const encoded = iconv.encode(text, this.getEncodingName(encoding))

    return terminated ? Buffer.concat([encoded, Buffer.alloc(this.getTerminationCount(encoding), 0x00)]) : encoded
}

/*
**  comment => object {
**      language:   string (3 characters),
**      text:       string
**      shortText:  string
**  }
**/
protected createCommentFrame(comment: Comment) {
    comment = comment || {}
    if(!comment.text) {
        return null
    }

    // Create frame header
    const buffer = Buffer.alloc(10)
    buffer.fill(0)
    buffer.write("COMM", 0)                 //  Write header ID

    const encodingBuffer = this.createTextEncoding(0x01)
    const languageBuffer = this.createLanguage(comment.language)
    const descriptorBuffer = this.createContentDescriptor(comment.shortText, 0x01, true)
    const textBuffer = this.createText(comment.text, 0x01, false)

    buffer.writeUInt32BE(encodingBuffer.length + languageBuffer.length + descriptorBuffer.length + textBuffer.length, 4)
    return Buffer.concat([buffer, encodingBuffer, languageBuffer, descriptorBuffer, textBuffer])
}

/*
**  frame   => Buffer
*/
protected readCommentFrame(frame: Buffer) {
    let tags = {}

    if(!frame) {
        return tags
    }
    if(frame[0] === 0x00) {
        tags = {
            language: iconv.decode(frame, "ISO-8859-1").substring(1, 4).replace(/\0/g, ""),
            shortText: iconv.decode(frame, "ISO-8859-1").substring(4, frame.indexOf(0x00, 1)).replace(/\0/g, ""),
            text: iconv.decode(frame, "ISO-8859-1").substring(frame.indexOf(0x00, 1) + 1).replace(/\0/g, "")
        }
    } else if(frame[0] === 0x01) {
        let descriptorEscape = 0
        while(frame[descriptorEscape] !== undefined && frame[descriptorEscape] !== 0x00 || frame[descriptorEscape + 1] !== 0x00 || frame[descriptorEscape + 2] === 0x00) {
            descriptorEscape++
        }
        if(frame[descriptorEscape] === undefined) {
            return tags
        }
        const shortText = frame.slice(4, descriptorEscape)
        const text = frame.slice(descriptorEscape + 2)

        tags = {
            language: frame.toString().substring(1, 4).replace(/\0/g, ""),
            shortText: iconv.decode(shortText, "utf16").replace(/\0/g, ""),
            text: iconv.decode(text, "utf16").replace(/\0/g, "")
        }
    }

    return tags
}

/*
**  unsynchronisedLyrics => object {
**      language:   string (3 characters),
**      text:       string
**      shortText:  string
**  }
**/
protected createUnsynchronisedLyricsFrame(unsynchronisedLyrics: UnsynchronisedLyrics | string) {
    if(typeof unsynchronisedLyrics === 'string' || unsynchronisedLyrics instanceof String) {
        unsynchronisedLyrics = ({
            text: unsynchronisedLyrics
        } as UnsynchronisedLyrics)
    }
    if(!unsynchronisedLyrics || !unsynchronisedLyrics.text) {
        return null
    }

    // Create frame header
    const buffer = Buffer.alloc(10)
    buffer.fill(0)
    buffer.write("USLT", 0)                 //  Write header ID

    const encodingBuffer = this.createTextEncoding(0x01)
    const languageBuffer = this.createLanguage(unsynchronisedLyrics.language)
    const descriptorBuffer = this.createContentDescriptor(unsynchronisedLyrics.shortText, 0x01, true)
    const textBuffer = this.createText(unsynchronisedLyrics.text, 0x01, false)

    buffer.writeUInt32BE(encodingBuffer.length + languageBuffer.length + descriptorBuffer.length + textBuffer.length, 4)
    return Buffer.concat([buffer, encodingBuffer, languageBuffer, descriptorBuffer, textBuffer])
}

/*
**  frame   => Buffer
*/
protected readUnsynchronisedLyricsFrame(frame: Buffer) {
    let tags = {}

    if(!frame) {
        return tags
    }
    if(frame[0] === 0x00) {
        tags = {
            language: iconv.decode(frame, "ISO-8859-1").substring(1, 4).replace(/\0/g, ""),
            shortText: iconv.decode(frame, "ISO-8859-1").substring(4, frame.indexOf(0x00, 1)).replace(/\0/g, ""),
            text: iconv.decode(frame, "ISO-8859-1").substring(frame.indexOf(0x00, 1) + 1).replace(/\0/g, "")
        }
    } else if(frame[0] === 0x01) {
        let descriptorEscape = 0
        while(frame[descriptorEscape] !== undefined && frame[descriptorEscape] !== 0x00 || frame[descriptorEscape + 1] !== 0x00 || frame[descriptorEscape + 2] === 0x00) {
            descriptorEscape++
        }
        if(frame[descriptorEscape] === undefined) {
            return tags
        }
        const shortText = frame.slice(4, descriptorEscape)
        const text = frame.slice(descriptorEscape + 2)

        tags = {
            language: frame.toString().substring(1, 4).replace(/\0/g, ""),
            shortText: iconv.decode(shortText, "utf16").replace(/\0/g, ""),
            text: iconv.decode(text, "utf16").replace(/\0/g, "")
        }
    }

    return tags
}

/*
**  comment => object / array of objects {
**      description:    string
**      value:          string
**  }
**/
protected createUserDefinedText(userDefinedText: UserDefinedText | UserDefinedText[], recursiveBuffer?: Buffer): Buffer {
    let udt: UserDefinedText = {} as UserDefinedText;
    if(userDefinedText instanceof Array && userDefinedText.length > 0) {
        if(!recursiveBuffer) {
            // Don't alter passed array value!
            udt = userDefinedText.slice(0).pop()!
        } else {
            udt = userDefinedText.pop()!
        }
    }

    if(udt && udt.description) {
        // Create frame header
        const buffer = Buffer.alloc(10)
        buffer.fill(0)
        buffer.write("TXXX", 0)                 //  Write header ID

        const encodingBuffer = this.createTextEncoding(0x01)
        const descriptorBuffer = this.createContentDescriptor(udt.description, 0x01, true)
        const valueBuffer = this.createText(udt.value, 0x01, false)

        buffer.writeUInt32BE(encodingBuffer.length + descriptorBuffer.length + valueBuffer.length, 4)
        if(!recursiveBuffer) {
            recursiveBuffer = Buffer.concat([buffer, encodingBuffer, descriptorBuffer, valueBuffer])
        } else {
            recursiveBuffer = Buffer.concat([recursiveBuffer, buffer, encodingBuffer, descriptorBuffer, valueBuffer])
        }
    }
    if(userDefinedText instanceof Array && userDefinedText.length > 0) {
        return this.createUserDefinedText(userDefinedText, recursiveBuffer)
    } else {
        return recursiveBuffer || Buffer.from([])
    }
}

/*
**  frame   => Buffer
*/
protected readUserDefinedText(frame: Buffer) {
    let tags = {}

    if(!frame) {
        return tags
    }
    if(frame[0] === 0x00) {
        tags = {
            description: iconv.decode(frame, "ISO-8859-1").substring(1, frame.indexOf(0x00, 1)).replace(/\0/g, ""),
            value: iconv.decode(frame, "ISO-8859-1").substring(frame.indexOf(0x00, 1) + 1).replace(/\0/g, "")
        }
    } else if(frame[0] === 0x01) {
        let descriptorEscape = 0
        while(frame[descriptorEscape] !== undefined && frame[descriptorEscape] !== 0x00 || frame[descriptorEscape + 1] !== 0x00 || frame[descriptorEscape + 2] === 0x00) {
            descriptorEscape++
        }
        if(frame[descriptorEscape] === undefined) {
            return tags
        }
        const description = frame.slice(1, descriptorEscape)
        const value = frame.slice(descriptorEscape + 2)

        tags = {
            description: iconv.decode(description, "utf16").replace(/\0/g, ""),
            value: iconv.decode(value, "utf16").replace(/\0/g, "")
        }
    }

    return tags
}

/*
**  popularimeter => object {
**      email:    string,
**      rating:   int
**      counter:  int
**  }
**/
protected createPopularimeterFrame(popularimeter: Popularimeter) {
    popularimeter = popularimeter || {}
    const email = popularimeter.email
    let rating = Math.trunc(popularimeter.rating)
    let counter = Math.trunc(popularimeter.counter)
    if(!email) {
        return null
    }
    if(isNaN(rating) || rating < 0 || rating > 255) {
        rating = 0
    }
    if(isNaN(counter) || counter < 0) {
        counter = 0
    }

    // Create frame header
    const buffer = Buffer.alloc(10, 0)
    buffer.write("POPM", 0)                 //  Write header ID

    let emailBuffer = this.createText(email, 0x01, false)
    emailBuffer = Buffer.from(email + '\0', 'utf8')
    const ratingBuffer = Buffer.alloc(1, rating)
    const counterBuffer = Buffer.alloc(4, 0)
    counterBuffer.writeUInt32BE(counter, 0)

    buffer.writeUInt32BE(emailBuffer.length + ratingBuffer.length + counterBuffer.length, 4)
    const frame = Buffer.concat([buffer, emailBuffer, ratingBuffer, counterBuffer])
    return frame
}

/*
**  frame   => Buffer
*/
protected readPopularimeterFrame(frame: Buffer) {
    const tags: any = {}

    if(!frame) {
        return tags
    }
    const endEmailIndex = frame.indexOf(0x00, 1)
    if(endEmailIndex > -1) {
        tags.email = iconv.decode(frame.slice(0, endEmailIndex), "ISO-8859-1")
        const ratingIndex = endEmailIndex + 1
        if(ratingIndex < frame.length) {
            tags.rating = frame[ratingIndex]
            const counterIndex = ratingIndex + 1
            if(counterIndex < frame.length) {
                const value = frame.slice(counterIndex, frame.length)
                if(value.length >= 4) {
                    tags.counter = value.readUInt32BE()
                }
            }
        }
    }
    return tags
}

/*
**  _private => object|array {
**      ownerIdentifier:    string,
**      data:   buffer|string
**  }
**/
protected createPrivateFrame(_private: PrivateFrame) {
    if(_private instanceof Array && _private.length > 0) {
        const frames: Buffer[] = []
        _private.forEach(tag => {
            const frame = this.createPrivateFrameHelper(tag)
            if(frame) {
                frames.push(frame)
            }
        })
        return frames.length ? Buffer.concat(frames) : null
    } else {
        return this.createPrivateFrameHelper(_private)
    }
}

protected createPrivateFrameHelper(_private: PrivateFrame) {
    if(!_private || !_private.ownerIdentifier || !_private.data) {
        return null;
    }
    const header = Buffer.alloc(10, 0)
    header.write("PRIV")
    const ownerIdentifier = Buffer.from(_private.ownerIdentifier + "\0", "utf8")
    let data
    if(typeof(_private.data) === "string") {
        data = Buffer.from(_private.data, "utf8")
    } else {
        data = _private.data
    }

    header.writeUInt32BE(ownerIdentifier.length + data.length, 4)
    return Buffer.concat([header, ownerIdentifier, data])
}

/*
**  frame   => Buffer
*/
protected readPrivateFrame(frame: Buffer) {
    const tags: any = {}

    if(!frame) {
        return tags
    }

    const endOfOwnerIdentification = frame.indexOf(0x00)
    if(endOfOwnerIdentification === -1) {
        return tags
    }

    tags.ownerIdentifier = iconv.decode(frame.slice(0, endOfOwnerIdentification), "ISO-8859-1")

    if(frame.length <= endOfOwnerIdentification + 1) {
        return tags
    }

    tags.data = frame.slice(endOfOwnerIdentification + 1)

    return tags
}


/*
**  chapter => object|array {
**      startTimeMs:    number,
**      endTimeMs:   number,
**      startOffsetBytes: number,
**      endOffsetBytes: number,
**      tags: object
**  }
**/
protected createChapterFrame(chapter: Chapter) {
    if(chapter instanceof Array && chapter.length > 0) {
        const frames: Buffer[] = []
        chapter.forEach((tag, index) => {
            const frame = this.createChapterFrameHelper(tag, index + 1)
            if(frame) {
                frames.push(frame)
            }
        })
        return frames.length ? Buffer.concat(frames) : null
    } else {
        return this.createChapterFrameHelper(chapter, 1)
    }
}

protected createChapterFrameHelper(chapter: any, id: any) {
    if(!chapter || !chapter.elementID || !chapter.startTimeMs || !chapter.endTimeMs) {
        return null
    }

    const header = Buffer.alloc(10, 0)
    header.write("CHAP")

    const elementIDBuffer = Buffer.from(chapter.elementID + "\0")
    const startTimeBuffer = Buffer.alloc(4)
    startTimeBuffer.writeUInt32BE(chapter.startTimeMs)
    const endTimeBuffer = Buffer.alloc(4)
    endTimeBuffer.writeUInt32BE(chapter.endTimeMs)
    const startOffsetBytesBuffer = Buffer.alloc(4, 0xFF)
    if(chapter.startOffsetBytes) {
        startOffsetBytesBuffer.writeUInt32BE(chapter.startOffsetBytes)
    }
    const endOffsetBytesBuffer = Buffer.alloc(4, 0xFF)
    if(chapter.endOffsetBytes) {
        endOffsetBytesBuffer.writeUInt32BE(chapter.endOffsetBytes)
    }

    let frames
    if(chapter.tags) {
        frames = this.createBuffersFromTags(chapter.tags)
    }
    const framesBuffer = frames ? Buffer.concat(frames) : Buffer.alloc(0)

    header.writeUInt32BE(elementIDBuffer.length + 16 + framesBuffer.length, 4)
    return Buffer.concat([header, elementIDBuffer, startTimeBuffer, endTimeBuffer, startOffsetBytesBuffer, endOffsetBytesBuffer, framesBuffer])
}

/*
**  frame   => Buffer
*/
protected readChapterFrame(frame: Buffer) {
    const tags: any = {}

    if(!frame) {
        return tags
    }

    const endOfElementIDString = frame.indexOf(0x00)
    if(endOfElementIDString === -1 || frame.length - endOfElementIDString - 1 < 16) {
        return tags
    }

    tags.elementID = iconv.decode(frame.slice(0, endOfElementIDString), "ISO-8859-1")
    tags.startTimeMs = frame.readUInt32BE(endOfElementIDString + 1)
    tags.endTimeMs = frame.readUInt32BE(endOfElementIDString + 5)
    if(frame.readUInt32BE(endOfElementIDString + 9) !== Buffer.alloc(4, 0xff).readUInt32BE()) {
        tags.startOffsetBytes = frame.readUInt32BE(endOfElementIDString + 9)
    }
    if(frame.readUInt32BE(endOfElementIDString + 13) !== Buffer.alloc(4, 0xff).readUInt32BE()) {
        tags.endOffsetBytes = frame.readUInt32BE(endOfElementIDString + 13)
    }

    if(frame.length - endOfElementIDString - 17 > 0) {
        const framesBuffer = frame.slice(endOfElementIDString + 17)
        tags.tags = this.getTagsFromFrames(this.getFramesFromID3Body(framesBuffer, 3, 4, 10), 3)
    }

    return tags
}

protected proxyCall(funcName: string, p1: any, p2?: any) {
    switch (funcName) {
        case 'createCommentFrame':
            return this.createCommentFrame(p1)
        case 'readCommentFrame':
            return this.readCommentFrame(p1)
        case 'createPictureFrame':
            return this.createPictureFrame(p1)
        case 'readPictureFrame':
            return this.readPictureFrame(p1, p2)
        case 'createUnsynchronisedLyricsFrame':
            return this.createUnsynchronisedLyricsFrame(p1)
        case 'readUnsynchronisedLyricsFrame':
            return this.readUnsynchronisedLyricsFrame(p1)
        case 'createUserDefinedText':
            return this.createUserDefinedText(p1)
        case 'readUserDefinedText':
            return this.readUserDefinedText(p1)
        case 'createPopularimeterFrame':
            return this.createPopularimeterFrame(p1)
        case 'readPopularimeterFrame':
            return this.readPopularimeterFrame(p1)
        case 'createPrivateFrame':
            return this.createPrivateFrame(p1)
        case 'readPrivateFrame':
            return this.readPrivateFrame(p1)
        case 'createChapterFrame':
            return this.createChapterFrame(p1)
        case 'readChapterFrame':
            return this.readChapterFrame(p1)
    }
}

}

export default new NodeID3();