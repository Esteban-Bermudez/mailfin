export function generateHtmlTemplate(data: any) {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h3 style="text-align: center;">A new movie was added to Jellyfin</h3>
        <h1 style="text-align: center;">${data.title}</h1>
        <table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse;">
          <tr>
            <td style="text-align: center; padding: 10px;">
              <img
                src="${data.posterPath}"
                alt="${data.title} poster"
                style="width: 100%; max-width: 300px; height: auto; border-radius: 10px;"
              />
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; text-align: center;">
              <h3>${data.title} (${data.releaseDate})</h3>
              <p style="padding: 0 15px;">${data.overview}</p>
            </td>
          </tr>
          <tr>
            <td align="center" bgcolor="#007ca6" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                  <a href="" style="background-color:#007ca6; border:1px solid #333333; border-color:#333333; border-radius:6px; border-width:1px; color:#ffffff; display:inline-block; font-size:14px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 18px 12px 18px; text-align:center; text-decoration:none; border-style:solid;" target="_blank">Button Text</a>
            </td>
          </tr>
        </table>
        <footer style="text-align: center; margin-top: 20px;">
          <p style="font-size: 12px; color: #AAA;">Esteban Bermudez &copy; 2024</p>
        </footer>
      </body>
    </html>
  `
}
