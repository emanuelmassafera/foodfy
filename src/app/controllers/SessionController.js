const User = require("../models/User");
const crypto = require("crypto");
const mailer = require("../../lib/mailer");
const { hash } = require("bcryptjs");

module.exports = {
  loginForm(req, res) {
    return res.render("private-access/session/login");
  },

  login(req, res) {
    req.session.userId = req.user.id;

    return res.redirect("/admin/recipes");
  },

  logout(req, res) {
    req.session.destroy();

    return res.redirect("/admin/recipes");
  },

  forgotPasswordForm(req, res) {
    return res.render("private-access/session/forgot-password");
  },

  async forgotPassword(req, res) {
    const user = req.user;

    try {
      const token = crypto.randomBytes(20).toString("hex");

      let now = new Date();
      now = now.setHours(now.getHours() + 1);

      await User.updateFields(user.id, {
        reset_token: token,
        reset_token_expires: now,
      });

      await mailer.sendMail({
        to: user.email,
        from: "no-reply@foody.com.br",
        subject: "Recuperação de senha",
        html: `<h2>Esqueceu a senha?</h2>
            <p>Não se preocupe, clique no link abaixo para recuperá-la.</p>
            <p>
                <a href="http://localhost:3000/admin/users/change-password?token=${token}" target="_blank">
                    RECUPERAR SENHA
                </a>
            </p>
            `,
      });

      return res.render("private-access/session/forgot-password", {
        success: "Verifique seu email para resetar sua senha!",
      });
    } catch (error) {
      console.error(error);
      return res.render("private-access/session/forgot-password", {
        error: "Erro inesperado, tente novamente!",
      });
    }
  },

  changePasswordForm(req, res) {
    return res.render("private-access/session/change-password", { token: req.query.token });
  },

  async changePassword(req, res) {
    const user = req.user;
    const { password, token } = req.body;

    try {
      const newPassword = await hash(password, 8);
      
      await User.updateFields(user.id, {
          password: newPassword,
          reset_token: "",
          reset_token_expires: "",
      });

      return res.render("private-access/session/login", {
          user: req.body,
          success: "Senha alterada com sucesso! Faça o seu login."
      });

    } catch (error) {

      console.error(error);

      return res.render("private-access/session/change-password", {
        user: req.body,
        token,
        error: "Erro inesperado, tente novamente!",
      });
    }
  },
};
