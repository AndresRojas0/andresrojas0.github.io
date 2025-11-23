---
layout: base.njk
title: AAI | IAA
---

Hola, mi nombre es Andrés y soy un entusiasta de la inteligencia artificial. En este espacio comparto mi experiencia usando IA como pasatiempo y herramienta de aprendizaje, explorando sus aplicaciones prácticas en el desarrollo de software, análisis de datos y automatización de procesos.

## Escritura

<div class="writing-section">

{% for post in collections.post %}
<span class="year-marker">{% if post.data.date %}({{ post.data.date | date: '%Y' }}){% endif %}</span>

[{{ post.data.title }}](/posts/{{ post.data.slug }}/)

{% endfor %}

</div>

## Contacto

* GitHub: [@andresrojas0](https://github.com/andresrojas0)
