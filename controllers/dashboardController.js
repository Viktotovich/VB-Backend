const db = require("../db");

module.exports.getDashboard = (req, res) => {
  res.json({ message: "success" });
};

module.exports.postBlog = async (req, res) => {
  const build = req.body;
  const userId = req.user.id;
  const title = build.blocks[0].content;

  console.log(req.body); //TODO: scan for file, make isTemp false if images included

  //if there is a file included, make the file isTemp False
  try {
    await db.post.create({
      data: {
        title: title,
        content: build,
        categories: {
          connectOrCreate: {
            where: {
              name: "No Category",
            },
            create: {
              name: "No Category",
            },
          },
        },
        userId: userId,
      },
    });

    res.json({ message: "success" });
  } catch (err) {
    console.error(err);
    res.json({ message: "failed", error: err });
  }
};
