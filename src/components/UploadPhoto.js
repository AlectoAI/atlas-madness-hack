import React, { Component, setState } from 'react'
import axios from 'axios'
import '../index.css'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'

export default class UploadPhoto extends Component {
  constructor (props) {
    super(props)
    this.state = {
      file: null,
      embedding: [],
      imagelist: [],
      finallist: [],
      urls: [],
      isUploaded: false,
      isuploadSuccess: false,
      errorMessage: ''
    }
  }

  componentDidMount () {
    this.asyncHandleImage()
  }

  asyncHandleImage = async () => {
    // const querySnapshot = await getDocs(collection(db, 'celeb_images'))
    // const imagelist = []
    // await querySnapshot.forEach((childSnapshot) => {
    //   const { imagename, photoVector } = childSnapshot.data()
    //   const storage = getStorage()
    //   const path = 'celeb_image/' + imagename
    //   const reference = ref(storage, path)

    // imagelist.push({
    //   imagename,
    //   imagevector: photoVector,
    //   id: childSnapshot.id
    // })
    // })

    // console.log('imagelist', imagelist)
    const url = 'https://atlashackbackend-7uztfekh2a-uc.a.run.app/fetchall'
    axios.get(url).then(res => {
      const imagelist = []
      console.log(res.data)
      const result = res.data
      result.forEach(element =>
        imagelist.push({
          imagename: element.imagename,
          imagevector: element.photoVector
        })
      )
      this.setState({ imagelist })
    })
    // return imagelist
  }

  asyncHandleURL = async (reference) => {
    await getDownloadURL(reference).then((x) => {
      console.log('x', x)
      return x
    })
  }

  getImageCollect = async () => {
    await this.asyncHandleImage()
    const finalresult = []
    const urls = []
    this.state.imagelist.forEach(el => {
      const cur = el.imagevector
      const sim = this.euclidean(this.state.embedding, cur)
      finalresult.push({ e: el, s: Math.abs(sim) })
    })
    finalresult.sort((a, b) => (a.s > b.s) ? 1 : -1)
    const similar = []
    for (let i = 0; i < 5; i++) {
      similar.push(finalresult[i].e)
    }
    this.setState({ finallist: similar })

    const storage = getStorage()

    for (const image of similar) {
      const path = 'celeb_image/' + image.imagename
      const reference = ref(storage, path)
      const curURL = await getDownloadURL(reference)
      urls.push(curURL)
    }
    this.setState({ urls })
  }

  handleFile (e) {
    const file = e.target.files[0]
    this.setState({ file })
  }

  handleUpload (e) {
    console.log(this.state.file)
    this.uploadImage(this.state.file)
  }

  handleClick (e) {
    console.log(this.state.embedding)
  }

  euclidean (A, B) {
    let sumSub = 0
    A.forEach((ele, i) => {
      sumSub += +Math.pow(ele - B[i], 2)
    })
    return Math.sqrt(sumSub)
  }

  cosinesim (A, B) {
    let dotproduct = 0
    let mA = 0
    let mB = 0
    for (let i = 0; i < A.length; i++) {
      dotproduct += (A[i] * B[i])
      mA += (A[i] * A[i])
      mB += (B[i] * B[i])
    }
    const mAA = Math.sqrt(mA)
    const mBB = Math.sqrt(mB)
    const similarity = (dotproduct) / ((mAA) * (mBB))

    return similarity
  }

  uploadImage = (file) => {
    this.setState({ errorMessage: 'Please Wait...' })
    try {
      console.log('Upload Image', file)
      const formData = new FormData()
      formData.append('image', file)
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
      const url = 'https://alecto-api-7uztfekh2a-uc.a.run.app/process/'

      axios.post(url, formData, config).then(res => {
        console.log(res.data)
        const uploadStatus = res.data.success
        if (uploadStatus) {
          this.setState({ errorMessage: 'Uploaded Successfully!' })
          this.setState({ isUploadSuccess: true })
          this.setState({ embedding: res.data.embedding })
        } else {
          this.setState({ errorMessage: 'Face could not be detected. Please confirm that the picture you just uploaded contains a clear face.' })
          this.setState({ isUploadSuccess: false })
          this.setState({ urls: [] })
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  render () {
    const isUploadedSuccess = this.state.isUploadSuccess
    const isUploaded = this.state.isUploaded
    return (
      <div className="grid place-items-center">
        <div>
          <br/>
          <h2 className="text-[40px]">Upload photo to start a search</h2>
          <br/>
          <br/>
          <input className="text-[30px] center-input" type="file" name="file" onChange={e => this.handleFile(e)}/>
          <br/>
          <br/>
          <button className="center-upload_button bg-orange-500 hover:bg-orange-700 text-white font-bold py-3 px-20 rounded-full" onClick={e => this.handleUpload(e)}>Upload</button>
          <br/>
          <p align="center">{this.state.errorMessage}</p>
          <br/>
          <div>
            {isUploadedSuccess
              ? (<button className="center-upload_button bg-yellow-500 hover:bg-orange-700 text-white font-bold py-3 px-20 rounded-full" onClick={this.getImageCollect}>Get Similar Photo</button>)
              : (<p></p>)}
          </div>
        </div>
        <br/>
        <br/>
        <div className="grid gap-4 grid-cols-3 grid-rows-2">
          {this.state.urls.map((image, index) => {
            return (
              <div key={index} style={{ width: '300px' }}>
                <img src={image} style={{ maxWidth: '100%' }} />
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
