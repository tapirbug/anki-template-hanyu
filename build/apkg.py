#!/usr/bin/env python
from anki.collection import Collection
from anki.importing.apkg import AnkiPackageImporter
import os
import shutil
import sys

templates = [
  (
    # if this key phrase is found on the front template
    "anki-template-hanyu-speak",
    # then use front.html and back.html in this directory for the card type
    "templates/speak",
    # and for skeleton apkg use this front HTML
    "anki-template-hanyu-speak-front {{Deutsch}}",
    # and this back HTML
    "anki-template-hanyu-speak-back {{Pīnyīn}}"
  ),
  (
    "anki-template-hanyu-write",
    "templates/write",
    "anki-template-hanyu-write-front {{Deutsch}}",
    "anki-template-hanyu-write-back {{汉字}}"
  ),
  (
    "anki-template-hanyu-read-hanzi",
    "templates/read_hanzi",
    "anki-template-hanyu-read-hanzi-front {{汉字}}",
    "anki-template-hanyu-read-hanzi-back {{Deutsch}}"
  ),
  (
    "anki-template-hanyu-read-pinyin",
    "templates/read_pinyin",
    "anki-template-hanyu-read-pinyin-front {{Pīnyīn}}",
    "anki-template-hanyu-read-pinyin-back {{Deutsch}}"
  ),
  (
    "anki-template-hanyu-hear",
    "templates/hear",
    "anki-template-hanyu-hear-front {{汉字}}",
    "anki-template-hanyu-hear-back {{Deutsch}}"
  ),
]

def apkg(ref_apkg_path, build_dir, output_apkg_basename):
  """Build anki package from a reference apkg, build directory, and output apkg
  
  Generates a new anki package by copying the reference and then customizing
  the tempates in the copy to use the new ones from the given build directory.
  The customized copy is stored in the build directory with the specified
  basename and the `.apkg` extension.
  """

  output_anki2_path = f"{build_dir}/{output_apkg_basename}.anki2"
  output_apkg_path = f"{build_dir}/{output_apkg_basename}.apkg"
  output_skeleton_apkg_path = f"{build_dir}/{output_apkg_basename}-skeleton.apkg"
  processing_temp_file = f"{build_dir}/{output_apkg_basename}.media.db2"
  processing_temp_dir = f"{build_dir}/{output_apkg_basename}.media"

  # remove remnants from previous builds first
  try:
    os.remove(output_anki2_path)
  except FileNotFoundError:
    pass
  try:
    os.remove(output_apkg_path)
  except FileNotFoundError:
    pass

  # import the apkg with the basic vocabulary and skeleton templates,

  # and patch it first with the skeleton contents
  collection = Collection(output_anki2_path)
  collection.import_anki_package(ref_apkg_path)
  for name_and_id in collection.models.all_names_and_ids():
    notetype = collection.models.get(name_and_id.id)
    
    patched = False
    for tmpl in notetype["tmpls"]:
      skeleton_html = get_skeleton_html(tmpl)
      if skeleton_html is not None:
        front_html, back_html = skeleton_html
        tmpl["qfmt"] = front_html
        tmpl["afmt"] = back_html
        patched = True
        print(f'{tmpl["name"]} patched {front_html} {back_html}')

    if patched:
      collection.models.save(notetype)
      print(f'patches saved for {notetype["name"]}')

  # export the skeleton templates as apkg so that new vocabulary can
  # be checked back in as skeleton.apkg
  collection.export_anki_package(
    out_path = output_skeleton_apkg_path,
    limit = None,
    with_scheduling = False,
    with_media = True,
    legacy_support = False
  )

  # and patch it with templates from the build
  for name_and_id in collection.models.all_names_and_ids():
    notetype = collection.models.get(name_and_id.id)
    
    patched = False
    for tmpl in notetype["tmpls"]:
      template_html = get_template_html(tmpl, build_dir)
      if template_html is not None:
        front_html, back_html = template_html
        tmpl["qfmt"] = front_html
        tmpl["afmt"] = back_html
        patched = True
        print(f'{tmpl["name"]} patched')

    if patched:
      collection.models.save(notetype)
      print(f'patches saved for {notetype["name"]}')

  # export the result with rich templates as apkg
  collection.export_anki_package(
    out_path = output_apkg_path,
    limit = None,
    with_scheduling = False,
    with_media = True,
    legacy_support = False
  )

  # done with the collection
  collection.close()

  # delete the collection itself and other temporary files the processing
  # leaves behind
  os.remove(output_anki2_path)
  os.remove(processing_temp_file)
  shutil.rmtree(processing_temp_dir)
  
  print("collection closed")

def get_template_html(tmpl, build_dir):
  """Gets contents of front.html and back.html as a two-element string tuple
  for the given note type or None if no suitable template defined
  """
  source_front_html = tmpl["qfmt"]
  source_back_html = tmpl["afmt"]
  for pattern, template_base_path, _f, _b in templates:
    if pattern in source_front_html:
      with open(f"{build_dir}/{template_base_path}/front.html") as front_file:
        with open(f"{build_dir}/{template_base_path}/back.html") as back_file:
          return (
            front_file.read(),
            back_file.read()
          )
  return None

def get_skeleton_html(tmpl):
  """Gets contents of front.html and back.html as a two-element string tuple
  for the given note type or None if no suitable template defined
  """
  source_front_html = tmpl["qfmt"]
  source_back_html = tmpl["afmt"]
  for pattern, _t, front_html, back_html in templates:
    if pattern in source_front_html:
      return (front_html, back_html)
  return None

apkg(*sys.argv[1:])