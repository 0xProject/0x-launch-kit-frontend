
import React from 'react';

declare var window:any;

interface Props {
    className?: string,
    style?: any, // eslint-disable-line
    client?: string,
    slot: string,
    layout?: string,
    format?: string,
    responsive?: string
}

export default class GoogleADS extends React.Component<Props> {
  componentDidMount() {
    if(window) (window.adsbygoogle = window.adsbygoogle || []).push({});

  };

  render() {
    return (
      <ins className={`${this.props.className || ''} adsbygoogle`}
        style={this.props.style || {display:'block'}} 
        data-ad-client={this.props.client || process.env.REACT_APP_GOOGLE_ADS_CLIENT } 
        data-ad-slot={this.props.slot}
        data-ad-layout={this.props.layout || ''}
        data-ad-format={this.props.format || 'auto'}
        data-full-width-responsive={this.props.responsive || 'false'}></ins>
    );
  }
};


/*Google.defaultProps = {
    className: '',
    style: {display: 'block'}, 
    format: 'auto',
    layout: '',
    responsive: 'false'
  };*/