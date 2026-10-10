---
layout: archive
title: "Travel"
permalink: /travel/
author_profile: true
---

<style>
.city { margin-bottom: 3em; padding-bottom: 2em; border-bottom: 1px solid rgba(128,128,128,.25); }
.city:last-child { border-bottom: none; }
.city h2 { margin-bottom: .2em; }
.city .meta { color: #777; font-size: .9em; margin-bottom: 1em; }
.proscons { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5em; margin: 1em 0; }
.proscons h4 { margin: 0 0 .4em; }
.proscons ul { margin: 0; padding-left: 1.2em; }
.city-photos { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: .6em; margin-top: 1em; }
.city-photos img { width: 100%; height: 140px; object-fit: cover; border-radius: 4px; }
@media (max-width: 600px) { .proscons { grid-template-columns: 1fr; } }
</style>

Gezdiğim şehirler ve notlarım ✈️<br>
Cities I have visited ✈️

{% for place in site.data.travel %}
<div class="city">
  <h2>{{ place.city }}</h2>
  <div class="meta">{{ place.country }} · {{ place.date }}</div>
  {% if place.summary %}{{ place.summary | markdownify }}{% endif %}
  <div class="proscons">
    {% if place.pros %}
    <div>
      <h4>👍 İyi yönleri</h4>
      <ul>{% for item in place.pros %}<li>{{ item }}</li>{% endfor %}</ul>
    </div>
    {% endif %}
    {% if place.cons %}
    <div>
      <h4>👎 Kötü yönleri</h4>
      <ul>{% for item in place.cons %}<li>{{ item }}</li>{% endfor %}</ul>
    </div>
    {% endif %}
  </div>
  {% if place.photos %}
  <div class="city-photos">
    {% for photo in place.photos %}
    <a href="{{ photo | relative_url }}" target="_blank"><img src="{{ photo | relative_url }}" alt="{{ place.city }}" loading="lazy"></a>
    {% endfor %}
  </div>
  {% endif %}
</div>
{% endfor %}