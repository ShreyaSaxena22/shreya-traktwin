const crypto = require("crypto");
// const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  insertdatatable,
  getMultiCondition,
  updateMultiCondition,
} = require("../models/Adminmodel");
const { title } = require("process");

module.exports = {
  getMainCategorylist: async (req, res) => {
    const session = req.session;
    if (session.token) {
      const maincatdata = await getMultiCondition("tbl_main_category_info", [
        { token: `${session.token}` },
        "AND",
        { flag: 0 },


      ]);
      res.render(
        "dashboard/panel/Category-management/Main-Category/main-cat-list",
        {
          title: "Main Category List || SOURABH",
          error: req.flash("error"),
          success: req.flash("success"),
          data: maincatdata,
        }
      );
    } else {
      res.redirect("/");
    }
  },

  getMainCategoryCreate: (req, res) => {
    const session = req.session;
    if (session.token) {
      res.render(
        "dashboard/panel/Category-management/Main-Category/create-main-cat",
        {
          title: "Create Main Category || SOURABH",
          error: req.flash("error"),
          success: req.flash("sucess"),
        }
      );
    } else {
      res.redirect("/");
    }
  },

  postMainCategory: async (req, res) => {
    const session = req.session;
    if (session.token) {
      // Generate a random token for the main category
      req.body.cat_main_token = crypto.randomBytes(64).toString("hex");

      // Create the directory path based on the token
      const folderPath = path.join(
        __dirname,
        `../public/Storage/category-management/main-category/${req.body.cat_main_token}`
      );

      // Create the directory recursively
      fs.mkdir(folderPath, { recursive: true }, (err) => {
        if (err) {
          console.error("Error creating directory:", err);
          req.flash("error", "Error creating directory.");
          return res.redirect("/maincategorylist/createmaincategory");
        }
      });

      // Check if any files were uploaded
      if (!req.files || Object.keys(req.files).length === 0) {
        req.flash("error", "No files were uploaded.");
        return res.redirect("/maincategorylist/createmaincategory");
      }

      // Access the uploaded file
      const uploadedFile = req.files.image;

      // Define the file path where the image will be saved
      const filePath = path.join(folderPath, uploadedFile.name);

      // Move the uploaded file to the defined file path
      uploadedFile.mv(filePath, async (err) => {
        if (err) {
          console.error("Error moving file:", err);
          req.flash("error", "Error uploading file.");
          return res.redirect("/maincategorylist/createmaincategory");
        }

        // File moved successfully, now save the data to the database
        const { cat_name, description, icon } = req.body;
        var publish_status = 0;
        const server_url = {
          server_url: `${req.protocol} + "://" + ${req.get('host')}`,
        }
        var create_date = new Date();
        var year = create_date.getFullYear();
        var month = (create_date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, add 1
        var day = create_date.getDate().toString().padStart(2, '0');
        var formattedDate = `${year}-${month}-${day}`;

        if (cat_name && description && icon) {
          try {
            const Data = {
              image: `${uploadedFile.name}`,
            };

            // Insert data into the database
            const Insertdata = await insertdatatable("tbl_main_category_info", {
              token: session.token,
              cat_main_token: req.body.cat_main_token,
              cat_name: cat_name,
              cat_des: description,
              server_url: server_url,
              publish_status: publish_status,
              icon: icon,
              image: Data.image,
              create_date: formattedDate,
              status: 1,
              flag: 0,
            });
            req.flash("success", "Data successfully uploaded");
            res.redirect(`/maincategorylist`);
          } catch (dbError) {
            console.error("Database error:", dbError);
            req.flash("error", "Database error: " + dbError.message);
            res.redirect(`/maincategorylist/createmaincategory`);
          }
        } else {
          req.flash("error", "Please fill all the required fields.");
          res.redirect(`/maincategorylist/createmaincategory`);
        }
      });
    } else {
      res.redirect("/");
    }
  },

  postmaincatpublish: async (req, res) => {
    const session = req.session;
    if (req.session.token) {
      const { cat_main_token } = req.body;
      const publish_status = {
        publish_status: 1,
      };
      const condition1 = { token: session.token };
      const condition2 = { cat_main_token: cat_main_token };
      const updatepublishdata = await updateMultiCondition(
        "tbl_main_category_info",
        publish_status,
        condition1,
        condition2
      );
      if (updatepublishdata) {
        req.flash("success", "Data Successfully Published");
        res.redirect("/maincategorylist");
        return;
      }
    } else {
      res.redirect("/");
    }
  },

  postmaincatunpublish: async (req, res) => {
    const session = req.session;
    if (req.session.token) {
      const { cat_main_token } = req.body;

      const publish_status = {
        publish_status: 0,
      };
      const condition1 = { token: session.token };
      const condition2 = { cat_main_token: cat_main_token };
      const updateunpublishdata = await updateMultiCondition(
        "tbl_main_category_info",
        publish_status,
        condition1,
        condition2
      );
      if (updateunpublishdata) {
        req.flash("success", "Data Successfully Unpublished");
        res.redirect("/maincategorylist");
        return;
      }
    } else {
      res.redirect("/");
    }
  },

  getdeleteCategory: async (req, res) => {
    const session = req.session;
    if (req.session.token) {
      const cat_main_token = req.query.cat_main_token;
      if (cat_main_token) {
        const flag = {
          flag: 1,
        }
        const condition1 = { token: session.token };
        const condition2 = { cat_main_token: cat_main_token };
        const updatedeleteata = await updateMultiCondition(
          "tbl_main_category_info",
          flag,
          condition1,
          condition2
        );
        if (updatedeleteata) {
          req.flash("success", "Data Successfully deleted");
          res.redirect("/maincategorylist");
          return;
        }
      } else {
        res.flash("error", "Problem: Please contact technical support");
        res.redirect("/maincategorylist");
      }
    } else {
      res.redirect("/");
    }
  },

  getCategoryDetails: async (req, res) => {
    const session = req.session;
    if (session.token) {
      const cat_main_token = req.query.cat_main_token;
      if (cat_main_token) {
        const categorydetails = await getMultiCondition("tbl_main_category_info", [
          { token: `${session.token}` },
          "AND",
          {
            cat_main_token: `${cat_main_token}`
          },
          "AND",
          { flag: 0 }
        ]);
        if (categorydetails) {
          res.render("dashboard/panel/Category-management/Main-Category/view_main_cat_detalis",
            {
              title: "View Main Category Details || SOURABH",
              error: req.flash("error"),
              success: req.flash("success"),
              data: categorydetails,
            });
        }
      } else {
        res.flash("error", "Problem: Please contact technical support");
        res.redirect("/maincategorylist");
      }
    } else {
      res.redirect("/");
    }
  },
  postcategoryupdatedetails: async (req, res) => {
    const session = req.session;
    if (session.token) {
      const { cat_main_token } = req.body;
      if (cat_main_token) {
        const { cat_name, cat_des, icon } = req.body;

        const folderPath = path.join(
          __dirname,
          `../public/Storage/category-management/main-category/${req.body.cat_main_token}`
        );

        if (!req.files || Object.keys(req.files).length === 0) {
          const data = {
            cat_name: cat_name,
            cat_des: cat_des,
            icon: icon,
          }

          const condition1 = { token: session.token };
          const condition2 = { cat_main_token: cat_main_token };
          // Update data into the database
          const updatecategory = await updateMultiCondition(
            "tbl_main_category_info",
            data,
            condition1,
            condition2
          );
          if (updatecategory) {
            req.flash("success", "Category updated successfully");
            return res.redirect("/maincategorylist");
          }
        } else {
          const uploadedFile = req.files.image;

          const filePath = path.join(folderPath, uploadedFile.name);
          uploadedFile.mv(filePath, async (err) => {
            if (err) {
              console.error("Error moving file:", err);
              req.flash("error", "Error uploading file.");
              return res.redirect("/maincategorylist");
            }
            const { cat_name, cat_des, icon } = req.body;
            try {
              const Data = {
                image: `${uploadedFile.name}`,
              };

              const data = {
                cat_name: cat_name,
                cat_des: cat_des,
                icon: icon,
                image: Data.image
              }

              const condition1 = { token: session.token };
              const condition2 = { cat_main_token: cat_main_token };
              // Update data into the database
              const updatecategory = await updateMultiCondition(
                "tbl_main_category_info",
                data,
                condition1,
                condition2
              );
              if (updatecategory) {
                req.flash("success", "Category updated successfully");
                return res.redirect("/maincategorylist");
              }
            } catch (dbError) {
              console.error("Database error:", dbError);
              req.flash("error", "Database error: " + dbError.message);
              res.redirect(`/maincategorylist/createmaincategory`);
            }
          });
        }
      }
    } else {
      res.redirect("/");
    }
  }
};
