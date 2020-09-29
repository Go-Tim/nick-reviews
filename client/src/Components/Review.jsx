import React from 'react';
import { FaThumbsUp, FaRegThumbsUp, FaRegFlag } from 'react-icons/fa';
import Moment from 'react-moment';
import axios from 'axios';

// Available props: review (review object)
export default class Review extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportBtn: 0,
      helpful: this.props.review.helpful,
      increment: 1
    };
    this.updateHelpfulCount = this.updateHelpfulCount.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.reportBtnClick = this. reportBtnClick.bind(this);
  }
        
  updateHelpfulCount() {
    axios.put('/api/helpful', {
      reviewId: this.props.review._id,
      increment: this.state.increment
    })
      .then((response) => {
        this.setState({
          helpful: this.state.helpful + this.state.increment,
          increment: this.state.increment * -1
        });
      })
      .catch((err) => console.error(err));

  handleMouseEnter() {
    this.setState({
      reportBtn: 100
    });
  }

  handleMouseLeave() {
    this.setState({
      reportBtn: 0
    });
  }

  reportBtnClick() {
    window.alert('Good lookin out! We\'ll check into this review.');
  }
          
  render() {

    // Create array of paragraphs from the review bodyText so I can map them to individual p tags:
    let bodyTextParagraphs = this.props.review.bodyText.split('\n');

    // Report button opacity conditional:
    const reportBtnStyle = {
      opacity: this.state.reportBtn,
    };

    return (
      <div>
        <div className="reviews-review" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
          <div className="reviews-avatar">
            <img src={this.props.review.profilePhoto} alt="User photo" />
          </div>
          <div className="reviews-review-body">
            <div className="reviews-header">
              <div className="reviews-thumb-username">
                <div className="reviews-thumbs-up">
                  <div className="reviews-thumbs-up-icon"><FaThumbsUp /></div>
                </div>
                <div className="reviews-username"><a href="#">{this.props.review.username}</a> recommends this listing.</div>
              </div>
              <div className="reviews-date"><Moment format="MMMM Do, YYYY">{this.props.review.date}</Moment></div>
            </div>
            <div className="reviews-review-text">
              {bodyTextParagraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
            </div>
            <div className="reviews-lower-btns">
              <div className="reviews-helpful-btn" onClick={this.updateHelpfulCount}>
                <div className="reviews-helpful-inner-text">
                  <div className="reviews-helpful-thumb-icon"><FaRegThumbsUp /></div>
                  <div>Helpful</div>
                </div>
                <div>{this.state.helpful}</div>
              </div>
              <div className="reviews-report-btn" style={reportBtnStyle} onClick={this.reportBtnClick}>
                <FaRegFlag />
                <div className="reviews-report-btn-text">Report</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
