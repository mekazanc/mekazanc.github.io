---
layout: archive
title: "Books"
permalink: /books/
author_profile: true
---

<style>
.book { display: flex; gap: 1.5em; margin-bottom: 2.5em; align-items: flex-start; }
.book img { width: 120px; flex-shrink: 0; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,.15); }
.book-placeholder { width: 120px; height: 180px; flex-shrink: 0; border-radius: 4px; background: rgba(128,128,128,.15); display: flex; align-items: center; justify-content: center; font-size: 2.5em; }
.book h3 { margin-top: 0; }
.book .meta { color: #777; font-size: .9em; margin-bottom: .6em; }
@media (max-width: 600px) { .book { flex-direction: column; } }
</style>

Bu yıl okuduğum kitaplar

{% for book in site.data.books %}
<div class="book">
  {% if book.cover %}
  <img src="{{ book.cover | relative_url }}" alt="{{ book.title }}">
  {% else %}
  <div class="book-placeholder">📖</div>
  {% endif %}
  <div>
    <h3>{{ book.title }}</h3>
    <div class="meta">{{ book.author }} · {{ book.finished }}</div>
    {{ book.summary | markdownify }}
  </div>
</div>
{% endfor %}