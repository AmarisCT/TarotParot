import pathlib
root = pathlib.Path(__file__).parent
src = root / "src"
tpl = (src / "index.template.html").read_text()
css = (src / "style.css").read_text()
js = "\n".join((src / n).read_text() for n in ["deck.js", "question.js", "art.js", "app.js"])
out = tpl.replace("/*STYLE*/", css).replace("/*SCRIPT*/", js)
(root / "index.html").write_text(out)
print("built", len(out), "bytes")
