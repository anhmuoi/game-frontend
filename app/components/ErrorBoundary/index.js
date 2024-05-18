import React from 'react'
import { PropTypes } from 'prop-types'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    if (process.env.NODE_ENV !== 'production') {
    //   Sentry.captureException(error)
      console.log(error, errorInfo)
    }
    this.setState({
      hasError: true
    })
  }

  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Paper>
        <Grid container spacing={24} style={{ height: 200}} justify="center" alignItems="center">
          <Grid item xs={12} style={{ textAlign: 'center'}}>
            <Typography variant="title">
              Something went wrong!
            </Typography>
          </Grid>
          <Grid item xs={12} style={{ textAlign: 'center'}}>
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={() => document.location.reload()}
            >
              Reload
            </Button>
          </Grid>
        </Grid>
        </Paper>
      )
    }
    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.element,
}

export default ErrorBoundary
