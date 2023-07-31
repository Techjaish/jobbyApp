import {Component} from 'react'
import {AiOutlineStar} from 'react-icons/ai'
import {BiLocationPlus} from 'react-icons/bi'
import {BsSearch} from 'react-icons/bs'
import {GiFirstAidKit} from 'react-icons/gi'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const apiStatusObj = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failed: 'FAILURE',
  nodata: 'NO DATA FOUND',
}

const employmentTypesList = [
  {
    id: 1,
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    id: 2,
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    id: 3,
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    id: 4,
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const ItemEl = props => {
  const {eachType, updateEmploymentType} = props
  const {label, employmentTypeId} = eachType

  const onButton = event => {
    console.log(event.target.checked)
    if (event.target.checked) {
      updateEmploymentType(employmentTypeId)
    }
  }
  return (
    <li>
      <input
        className="inputEl"
        type="checkbox"
        id={employmentTypeId}
        onClick={onButton}
      />
      <label htmlFor={employmentTypeId} className="labelEl">
        {label}
      </label>
    </li>
  )
}

const SalaryItemEl = props => {
  const {eachType, updateMinimumPackage} = props
  const {label, salaryRangeId} = eachType
  const onButton = event => {
    console.log(event.target.checked)
    if (event.target.checked) {
      updateMinimumPackage(salaryRangeId)
    }
  }

  return (
    <li>
      <input
        className="inputEl"
        type="radio"
        id={salaryRangeId}
        onClick={onButton}
      />
      <label htmlFor={salaryRangeId} className="labelEl">
        {label}
      </label>
    </li>
  )
}

const JobItem = props => {
  const {eachJobItem} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = eachJobItem
  console.log(id)
  return (
    <Link to={`/jobs/${id}`} className="link-style">
      <li className="job-item">
        <div className="job-item-container">
          <img src={companyLogoUrl} className="img" alt="company logo" />
          <div className="company-container">
            <h1 className="title">{title}</h1>
            <div className="spacial">
              <AiOutlineStar className="star" />
              <p className="title">{rating}</p>
            </div>
          </div>
        </div>
        <div className="user-spacial">
          <div className="userspecializing">
            <div>
              <BiLocationPlus className="location" />
              <p className="detail">{location}</p>
            </div>
            <div>
              <GiFirstAidKit className="kit" />
              <p className="detail">{employmentType}</p>
            </div>
          </div>
          <p className="title">{packagePerAnnum}</p>
        </div>

        <h1 className="title">Description</h1>
        <p className="description">{jobDescription}</p>
      </li>
    </Link>
  )
}

class Jobs extends Component {
  state = {
    listJobs: {},
    userInfo: {},
    isLoader: false,
    userApiStatus: apiStatusObj.initial,
    jobApiStatus: apiStatusObj.initial,
    employmentTypeId: '',
    searchVal: '',
    salaryRangeId: '',
  }

  componentDidMount() {
    console.log('componentDidMount is called')
    this.getInitialJobs()
  }

  getInitialJobs = async () => {
    this.setState({isLoader: true})
    const Token = Cookies.get('jwt_token')
    const url1 = 'https://apis.ccbp.in/profile'
    const url2 = `https://apis.ccbp.in/jobs`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    }
    const response1 = await fetch(url1, options)
    const response2 = await fetch(url2, options)
    const data1 = await response1.json()
    console.log(data1)
    if (data1.status_code === 401) {
      this.updateApiStatus()
    } else {
      const formatObj1 = {
        profileDetails: this.formatDataObj(data1.profile_details),
      }
      const data2 = await response2.json()

      const formatObj2 = {
        jobs: data2.jobs.map(eachJobs => this.getJobs(eachJobs)),
        total: data2.total,
      }
      if (data2.jobs.length === 0) {
        this.setState({
          userApiStatus: apiStatusObj.success,
          jobApiStatus: apiStatusObj.nodata,
          isLoader: false,
        })
      } else {
        this.setState({
          listJobs: formatObj2,
          userInfo: formatObj1,
          userApiStatus: apiStatusObj.success,
          jobApiStatus: apiStatusObj.success,
          isLoader: false,
        })
      }
    }
  }

  formatDataObj = Obj => ({
    name: Obj.name,
    profileImageUrl: Obj.profile_image_url,
    shortBio: Obj.short_bio,
  })

  getJobs = eachObj => ({
    companyLogoUrl: eachObj.company_logo_url,
    employmentType: eachObj.employment_type,
    id: eachObj.id,
    jobDescription: eachObj.job_description,
    location: eachObj.location,
    packagePerAnnum: eachObj.package_per_annum,
    rating: eachObj.rating,
    title: eachObj.title,
  })

  updateApiStatus = () => {
    this.setState({
      userApiStatus: apiStatusObj.failed,
      jobApiStatus: apiStatusObj.failed,
    })
  }

  getDataOf = async () => {
    this.setState({isLoader: false})
    const {employmentTypeId, searchVal, salaryRangeId} = this.state
    const Token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeId}&minimum_package=${salaryRangeId}&search=${searchVal}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()

    const formatObj = {
      jobs: data.jobs.map(eachJobs => this.getJobs(eachJobs)),
      total: data.total,
    }
    if (data.jobs.length === 0) {
      this.setState({
        userApiStatus: apiStatusObj.success,
        jobApiStatus: apiStatusObj.nodata,
        isLoader: false,
      })
    } else {
      this.setState({
        listJobs: formatObj,
        jobApiStatus: apiStatusObj.success,
      })
    }
  }

  updateEmploymentType = id => {
    this.setState(
      {employmentTypeId: id, jobApiStatus: apiStatusObj.initial},
      this.getDataOf,
    )
  }

  updateMinimumPackage = id => {
    this.setState(
      {salaryRangeId: id, jobApiStatus: apiStatusObj.initial},
      this.getDataOf,
    )
  }

  updateSearch = event => {
    this.setState(
      {
        searchVal: event.target.value,
        jobApiStatus: apiStatusObj.initial,
      },
      this.getDataOf,
    )
  }

  renderJobs = () => {
    const {listJobs} = this.state
    const {jobs} = listJobs

    return (
      <>
        <ul className="job-section-container">
          {jobs.map(eachJobItem => (
            <JobItem eachJobItem={eachJobItem} key={eachJobItem.id} />
          ))}
        </ul>
      </>
    )
  }

  renderNodata = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        className="no-data"
        alt="no data"
      />
      <h1 className="no-data-found">No Jobs Are Found</h1>
      <p>we could not found any jobs. Try other filter</p>
    </>
  )

  renderFailed = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-img"
        alt="failure view"
      />
      <h1 className="title">Oops! Something Went Wrong</h1>
      <p className="description">
        We cannot seem to find the page you are looking for
      </p>
      <div>{this.displayButton()}</div>
    </div>
  )

  checkJobs = () => {
    const {jobApiStatus} = this.state
    switch (jobApiStatus) {
      case apiStatusObj.success:
        return this.renderJobs()
      case apiStatusObj.failed:
        return this.renderFailed()
      case apiStatusObj.nodata:
        return this.renderNodata()
      default:
        return ''
    }
  }

  renderUserId = () => {
    const {userInfo} = this.state
    const {profileDetails} = userInfo
    const {name, profileImageUrl, shortBio} = profileDetails

    return (
      <div className="userId">
        <img src={profileImageUrl} className="user-img" alt="profile" />
        <h1 className="user-name">{name}</h1>
        <p className="user-description">{shortBio}</p>
      </div>
    )
  }

  updateState = () => {
    this.setState(
      {
        userApiStatus: apiStatusObj.initial,
        jobApiStatus: apiStatusObj.initial,
        isLoader: false,
      },
      this.getDataOf,
    )
  }

  displayButton = () => (
    <button className="button" type="button" onClick={this.updateState}>
      Retry
    </button>
  )

  checkUser = () => {
    const {userApiStatus} = this.state
    switch (userApiStatus) {
      case apiStatusObj.success:
        return this.renderUserId()
      case apiStatusObj.failed:
        return this.displayButton()
      default:
        return ''
    }
  }

  renderJobsContainer = () => {
    const {searchVal, isLoader} = this.state
    return (
      <>
        <div className="container1">
          {isLoader ? this.renderLoader() : this.checkUser()}
          <h1 className="filter">Type of Employment</h1>
          <ul className="list-container">
            {employmentTypesList.map(eachType => (
              <ItemEl
                eachType={eachType}
                key={eachType.employmentTypeId}
                updateEmploymentType={this.updateEmploymentType}
              />
            ))}
          </ul>
          <h1 className="filter">Salary Range</h1>
          <ul className="list-container">
            {salaryRangesList.map(eachType => (
              <SalaryItemEl
                eachType={eachType}
                key={eachType.salaryRangeId}
                updateMinimumPackage={this.updateMinimumPackage}
              />
            ))}
          </ul>
        </div>
        <div className="input-container">
          <input
            value={searchVal}
            className="inputEl"
            type="search"
            placeholder="Search"
            onChange={this.updateSearch}
          />
          <button
            type="button"
            className="search-button"
            data-testid="searchButton"
          >
            <BsSearch className="search-icon" />
          </button>
        </div>

        <div className="container2">
          {isLoader ? this.renderLoader() : this.checkJobs()}
        </div>
      </>
    )
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  render() {
    const {isLoader} = this.state
    return (
      <div className="job-container">
        <Header />
        <div className="section-container">
          {isLoader ? this.renderLoader() : this.renderJobsContainer()}
        </div>
      </div>
    )
  }
}

export default Jobs
