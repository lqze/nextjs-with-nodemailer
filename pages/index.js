import Head from 'next/head'
import { useState } from 'react'
import styles from '../styles/Home.module.css'

export default function Home(props) {

  /**
   * Define our useState hooks
   */
  const [formLoading, setFormLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const handleSubmission = async (event) => {
    event.preventDefault() // for AJAX form submission, e.g. prevent the page refresh on a form submit
    
    setFormLoading(true) // Show a "loading" status for our form element

    // Retrieve our form data
    const formData = {
      "name": document.getElementById('emailFormName').value,
      "email": document.getElementById('emailFormEmail').value,
    }

    // Send our data in JSON using the standard ES5 Fetch API
    fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    })
    .then(res => res.json()) // Transform our returned data into JSON
    .then(data => { 
      if (data) setStatusMessage(data.message) // Append our message
      setFormLoading(false) // Remove the loading state
    })
    .catch(err => {
      console.error(err)
      setStatusMessage(err.message) // display an error message
      setFormLoading(false)
    })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Next.js Nodemailer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Next.js - Nodemailer 
        </h1>
        <h2>
          SMTP form submission example
        </h2>
        <p>
          A simple example showcasing a form submission to a serverless API utilising <i><a href="https://nodemailer.com/about/">nodemailer</a></i>.<br/>
          The example uses an <b><a href="https://ethereal.email/">Ethereal Mail</a></b> set-up for example purposes.
        </p>
        <div className={styles.inner}>
          { formLoading 
            ? (<p>Loading ... </p>)
            : (
              <>
                <FormComponent submissionHandler={handleSubmission} styles={styles.form} />
                <div>
                  <pre>{statusMessage}</pre>
                </div>
              </>
            )
          }
        </div>
      </main>
    </div>
  )
}
/**
 * A simple form component which can be modifed to include more detail.
 * For a more complete solution, you may want to return a formData(myForm) object.
 * However, this will require the appropriate parsing on your serverless function 
 * to read your form data in a more readable format, e.g. JSON.
 */
function FormComponent(props) {
  const { submissionHandler, styles } = props
  return (
    <form id="emailForm" className={styles} method='POST' onSubmit={e => submissionHandler(e)}>
      <label>Name</label>
      <input id="emailFormName" name='name' type='text'/>
      <label>Email</label>
      <input id="emailFormEmail" required name='email' type='email'/>
      <input className="button" value="Submit" type='submit' />
    </form>
  )
}