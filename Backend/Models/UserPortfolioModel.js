const pool = require('../Src/Config/db');

class UserPortfolioModel {
  async createUser({
    name,
    email,
    profession,
    about,
    education,
    address,
    number,
    experience,
    companyName,
    designation,
    startDate,
    endDate,
    experienceDescription,
    skills,
  }) {
    const [result] = await pool.execute(
      'INSERT INTO Portfolio (name, email, profession, about, education, address, number, experience, companyName, designation, startDate, endDate, experienceDescription, skills) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, profession, about, education, address, number, experience, companyName, designation, startDate, endDate, experienceDescription, skills]
    );

    return result.insertId;
  }

  async getUserPortfolioByEmail(email) {
    try {
        const [result] = await pool.execute('SELECT * FROM Portfolio WHERE email = ?', [email]);

        if (result.length === 0) {
          
            return null;
        }

        return result[0];
    } catch (error) {
        console.error('Error fetching portfolio by email:', error);
        throw error; 
    }
}
async updateUserPortfolioByEmail({
  name,
  email,
  profession,
  about,
  education,
  address,
  number,
  experience,
  companyName,
  designation,
  startDate,
  endDate,
  experienceDescription,
  skills,
}) {
  try {
      const sql = `
          UPDATE Portfolio 
          SET name=?, profession=?, about=?, education=?, address=?, number=?, experience=?, companyName=?, designation=?, startDate=?, endDate=?, experienceDescription=?, skills=?
          WHERE email=?
      `;
      const values = [
          name,
          profession,
          about,
          education,
          address,
          number,
          experience,
          companyName,
          designation,
          startDate,
          endDate,
          experienceDescription,
          skills,
          email
      ];

      const [result] = await pool.execute(sql, values);
      console.log(`Portfolio updated for email: ${email}`);
      return result;
  } catch (error) {
      console.error('Error updating portfolio by email:', error);
      throw error;
  }
}

}

module.exports = {
  userPortfolioModel: new UserPortfolioModel(),
};
