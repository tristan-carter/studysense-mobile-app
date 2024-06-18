import html

def fix_encoding(text):
  text = text.replace("xe2x80x9c", "“")  # Replace hex code with left curly quote
  text = text.replace("xe2x80x9d", "”")  # Replace hex code with right curly quote
  return text

text = ""

fixed_text = fix_encoding(text)
print(fixed_text)