# mfml

Meta Fiction Markup Language

# stage 1

Choose Your Own Adventure style stories. No state is tracked or managed.

Although it is better to move to stage 2 if you need state, these can still sort 
of have state with an honour system, because you can ask the player things like, 
"click here if you have already visited the forest" or you can ask them to roll 
a dice and click on the result.

Ordinary HTML markup, but it has to follow a convention.

The HTML document which hosts the MFML runtime should be structured as follows:

```html
<section id="foo">
  <h1>Foo</h1>  
  <p>Foo is a bar.</p>  
  <ul>
    <li><a href="#bar">Go to bar</a></li>
    <li><a href="#qux">Go to qux</a></li>
  </ul>
</section>

<section id="bar">
  <h1>Bar</h1>  
  <p>Bar is a foo.</p>  
  <ul>
    <li><a href="#foo">Go to foo</a></li>
    <li><a href="#qux">Go to qux</a></li>
  </ul>
</section>

<section id="qux">
  <h1>Qux</h1>  
  <p>Qux is a foo.</p>  
  <ul>
    <li><a href="#foo">Go to foo</a></li>
    <li><a href="#bar">Go to bar</a></li>
  </ul>
</section>
```

The runtime looks for a section with id="start", if it doesn't find one, it
uses the first section.

All sections are hidden except the start. When the user navigates, it hides the
current section and shows the next.

It should also work without a runtime, just opening the HTML file, but the 
player can see all the sections at once, hashtag spoiler alert.

# stage 2

Add stage management, to track a player and lock or unlock things conditionally.

This is very simple state, just the existence (or not) of key strings. 

## keys

as a space separated list of "keys" in an attribute

a key can contain any character except a space, though some characters may be
treated specially:

- a key can be negated by prefixing it with a "!" character

## attributes

The following custom attributes are added:

### k-give and k-take 

a space separated list of "keys" to add or remove

If k-give or k-take are on a link, they will only be executed when the link is
navigated, otherwise they will be executed when encountered.

### q-if, q-or, q-not

a space separated list of "keys" to test - if the test fails, 
the element will be removed from the DOM

q-if expects all keys, q-or expects at least one key, q-not expects none of the
keys

You can please more than one query attribute on a tag, if you do so, all of them
must be true for the element to remain in the DOM.

If the element also contains give/take attributes, the queries will be tested
first, then the give/take will be executed.

If it also contains q-first, the queries will be executed before the q-first
is checked for children, therefore if the queries fail, the q-first will not be
checked.

### q-first

instead of filtering the element this is on, it will replace itself with the
first query child element that passes the test

```html
<m-f q-first>
  <h1 q-if="red" class="red">Red</h1>
  <h1 q-if="blue" class="blue">Blue</h1>
  <h1 q-if="green" class="green">Green</h1>
  <h1 q-else>Not Red, Blue or Green</h1>
</m-f>
```

### q-else

if nested within a q-first, will return the first q-else child found if nothing
else passes the test. if nested inside an attr that has q-xxx, it will return
the first q-else found if the q-xxx fails, or will be removed if the q-xxx
passes.

It is important to note that the q-else must be nested inside the q-xxx, not
a sibling

So, this:

```html
<p q-if="foo">
  <span>Foo</span>
  <span q-else>Not Foo</span>
</p>
```

Not this:
  
```html
<p q-if="foo">
  <span>Foo</span>
</p>
<p q-else><!-- this will always appear in the output! -->
  <span>Not Foo</span>
</p>
```

If you want a pattern that treats them as siblings, you can invert the test for
the else case:

```html
<p q-if="foo">Foo</p>
<p q-not="foo">Not Foo</p>
```

or:

```html
<p q-if="foo">Foo</p>
<p q-if="!foo">Not Foo</p>
```

## Tags

The following custom tag is added:

### m-f tag 

`<m-f></m-f>`

It does nothing except serve as a container for attributes if you need to
eg wrap text nodes and leave "nothing behind" after processing. The m-f tag is
removed when encountered, and replaced with its children.

## Example

HTML:

```html
<section id="start">
  <p>
    <span q-not="visitedStart">Welcome to game.</span>
    <span k-give="visitedStart">You are in room.</span>
  </p>
  <ul>
    <li>
      <a href="#treeRoom" k-give="choseTree">
        There is a door to the north with a picture of a tree on it.
      </a>
    </li>
    <li>
      <a href="#rockRoom" k-give="choseRock">
        There is a door to the south with a picture of a rock on it.
      </a>
    </li>
    <li>
      <a href="#flowerRoom" k-give="choseFlower">
        There is a door to the south with a picture of a flower on it.
      </a>
    </li>    
  </ul>
</section>

<section id="laterOn">
  <!-- we use first to prioritize which child, they might have all of them -->
  <p>
    <span q-first>
      <span q-if="choseTree">You chose the tree.</span>
      <span q-if="choseRock">You chose the rock.</span>
      <span q-if="choseFlower">You chose the flower.</span>
    </span>
  </p>
</section>
```
