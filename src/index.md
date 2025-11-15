---
layout: base.njk
---

### Publicaciones de Andrés

{% for post in collections.all %}
  <article>
    <h2><a href="/posts/{{ post.data.slug }}/">{{ post.data.title }}</a></h2>

    {% if post.data.image %}
      <img src="{{ post.data.image }}" alt="{{ post.data.title }}" width="500">
    {% endif %}

  </article>
{% endfor %}