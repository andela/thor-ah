const emailTemplate = {
  verficationEmailTemplate: url => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Authors Haven Email Template</title>
      <style>
        .container {
          box-sizing: border-box;
          font-family: 'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;
          font-size: 16px;
          vertical-align: top;
          padding: 30px;
          max-width: 600px;
          mnargin: auto;
        }
        .header {
          background: #fff;
        }
        .button {
          box-sizing: border-box;
          border-color: #348eda;
          font-weight: 400;
          text-decoration: none;
          display: inline-block;
          color: #ffffff;
          background-color: #348eda;
          border: solid 1px #348eda;
          border-radius: 2px;
          font-size: 14px;
          padding: 12px 45px;
        }
      </style>
    </head>
    <body>
      <section class="container">
        <header class="header">
          <h3>You're on your way!</h3>
          <h3>By clicking on the following link, you are confirming your email address</h3>
        </header>
        <p>Let's confirm your email address.<p>
        <a class="button" href="${url}">Confirm Email Address</a>
      </section>
    </body>
    </html>
  `
};

export default emailTemplate;
