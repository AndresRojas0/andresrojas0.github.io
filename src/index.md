---
layout: base.njk

---

Usando IA como pasatiempo y aprendiendo...

{% for post in collections.post %}
  <article>
    <h2><a href="/posts/{{ post.data.slug }}/">{{ post.data.title }}</a></h2>

    {% if post.data.date %}
    <time class="post-date">{{ post.data.date }}</time>
    {% endif %}

    {% if post.data.image %}
    <img src="{{ post.data.image }}" alt="{{ post.data.title }}" width="500">
    {% endif %}

  </article>
{% endfor %}