import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {AiOutlineStar} from 'react-icons/ai'
import {BiLocationPlus} from 'react-icons/bi'
import {GiFirstAidKit} from 'react-icons/gi'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const apiStatusObj = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failed: 'FAILURE',
}

const Skills = props => {
  const {eachImg} = props
  const {imageUrl, name} = eachImg

  return (
    <li className="Oneskills">
      <img src={imageUrl} className="skill-img" alt={name} />
      <p>{name}</p>
    </li>
  )
}

const SimilarJobItem = props => {
  const {similarJobItem} = props
  console.log(similarJobItem)
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = similarJobItem

  return (
    <li className="similar-item-container">
      <div className="job-item-container">
        <img
          src={companyLogoUrl}
          className="img"
          alt="similar job company logo"
        />
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
  )
}

class JobItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      jobId: 0,
      jobDetailsOf: {},
      isLoader: true,
      apiStatus: apiStatusObj.initial,
    }
  }

  componentDidMount() {
    this.getJobs()
  }

  formatEachSkill = eachSkill => ({
    imageUrl: eachSkill.image_url,
    name: eachSkill.name,
  })

  formatJobDetails = JobDetail => ({
    companyLogoUrl: JobDetail.company_logo_url,
    companyWebsiteUrl: JobDetail.company_website_url,
    employmentType: JobDetail.employment_type,
    id: JobDetail.id,
    jobDescription: JobDetail.job_description,
    lifeAtCompany: this.formatLifeCompany(JobDetail.life_at_company),
    location: JobDetail.location,
    packagePerAnnum: JobDetail.package_per_annum,
    rating: JobDetail.rating,
    skills: JobDetail.skills.map(eachSkill => this.formatEachSkill(eachSkill)),
    title: JobDetail.title,
  })

  formatLifeCompany = companyObj => ({
    description: companyObj.description,
    imageUrl: companyObj.image_url,
  })

  formatSimilarJobs = eachObj => ({
    companyLogoUrl: eachObj.company_logo_url,
    employmentType: eachObj.employment_type,
    id: eachObj.id,
    jobDescription: eachObj.job_description,
    location: eachObj.location,
    packagePerAnnum: eachObj.package_per_annum,
    rating: eachObj.rating,
    title: eachObj.title,
  })

  getJobs = async () => {
    const {match} = this.props
    const {params} = match
    console.log(params)

    const {id} = params
    const Token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${Token}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (data.status_code === 401) {
      this.setState({apiStatus: apiStatusObj.failed, isLoader: false})
    } else {
      const formalData = {
        jobDetails: this.formatJobDetails(data.job_details),
        similarJobs: data.similar_jobs.map(eachJob =>
          this.formatSimilarJobs(eachJob),
        ),
      }
      console.log(formalData)
      this.setState({
        jobId: id,
        jobDetailsOf: formalData,
        isLoader: false,
        apiStatus: apiStatusObj.success,
      })
    }
  }

  renderJobs = () => {
    const {jobDetailsOf, jobId} = this.state
    console.log(jobId)
    const {jobDetails} = jobDetailsOf
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      skills,
      title,
    } = jobDetails
    const {description, imageUrl} = lifeAtCompany

    return (
      <>
        <div className="job-items">
          <div className="job-item-container">
            <img
              src={companyLogoUrl}
              className="img"
              alt="job details company logo"
            />
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

          <div className="description-container">
            <h1 className="title">Description</h1>
            <a href={companyWebsiteUrl}>Visit</a>
          </div>
          <p className="description">{jobDescription}</p>
          <h1 className="title">Skills</h1>
          <ul className="skill-set">
            {skills.map(eachImg => (
              <Skills eachImg={eachImg} key={eachImg.name} />
            ))}
          </ul>
          <div className="lifeCompanyContainer">
            <div className="company-content">
              <h1 className="title">Life at Company</h1>
              <p className="description">{description}</p>
            </div>
            <img src={imageUrl} className="company-img" alt="life at company" />
          </div>
        </div>
        {this.renderSimilarJobs()}
      </>
    )
  }

  updateState = () => {
    this.setState(
      {
        isLoader: false,
      },
      this.getJobs,
    )
  }

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

  displayButton = () => (
    <button className="button" type="button" onClick={this.updateState}>
      Retry
    </button>
  )

  renderSimilarJobs = () => {
    const {jobDetailsOf} = this.state
    const {similarJobs} = jobDetailsOf

    return (
      <>
        <h1 className="title">Similar Jobs</h1>
        <ul className="similar-container">
          {similarJobs.map(similarJobItem => (
            <SimilarJobItem
              similarJobItem={similarJobItem}
              key={similarJobItem.id}
            />
          ))}
        </ul>
      </>
    )
  }

  checkAPi = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusObj.success:
        return this.renderJobs()
      case apiStatusObj.failed:
        return this.renderFailed()
      default:
        return ''
    }
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  render() {
    const {isLoader} = this.state
    return (
      <div className="main-job-container">
        <Header />
        <div className="container">
          {isLoader ? this.renderLoader() : this.checkAPi()}
        </div>
      </div>
    )
  }
}

export default JobItem
