---
layout: base.njk

---

Usando IA como pasatiempo y aprendiendo...

{% for post in collections.post %}
  <article class="post-item">
    <div class="post-content">
    <h2><a href="/posts/{{ post.data.slug }}/">{{ post.data.title }}</a></h2>

    {% if post.data.date %}
    <time class="post-date">{{ post.data.date }}</time>
    {% endif %}
    </div>

    {% if post.data.image %}
    <div class="post-thumbnail">
    <a href="/posts/{{ post.data.slug }}/">
      <img src="{{ post.data.image }}" alt="{{ post.data.title }}">
    </a>
    </div>
    {% endif %}

  </article>
{% endfor %}