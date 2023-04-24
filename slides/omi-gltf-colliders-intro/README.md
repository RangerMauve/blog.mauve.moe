# OMI glTF Colliders

## What

We at the OMI glTF extension working group have been putting together a set of glTF extensions that would enable nodes in a scene graph to be marked as colliders or physics bodies.
Our work involved looking at how game engines represent colliders accross the board so that we could focus on something that will be both easy to use and idiomatic regardless of where the glTF scene is loaded.

## Colliders

The first spec is the `OMI_collider` extension which attaches to nodes in a `glTF` scene under the `OMI_collider` key within the `extensions` object.

```json=
{
    "nodes": [{
        "name": "Ball",
        "extensions": {
            "OMI_collider": {
                "type": "sphere",
                "radius": 0.5
            }
        }
    }]
}
```

From there you can specify the `type` (`box`, `sphere`, `capsule`, `hull`, `mesh`), as well as some parameters that are specific to the type of collider it is.
We chose this list by looking at available primitives between engines and have figured out mappings ahead of time.
Note that in our documentation, we strongly discourage the use of `mesh` since it's performance characteristics are the weakest of all the types despite it's high level of flexibility.

On their own, colliders can be useful for importing scenes into a game engine where a programmer or designer can tweak the scene to actually make use to them.
However to make these glTF scenes useful on their own, we have also drafted up the `OMI_physics_body` spec.

## Physics Bodies

The OMI_physics_body spec can be used to mark certain nodes in the scene as being able to interact with physics.
You can attach the `OMI_physics_body` extension to a node's `extensions` object and specify a `type` (`static`, `kinematic`, `dynamic`, `trigger`).
These types were also based by looking at the physics bodies commonly used within major game engines.


```json=
{
    "nodes": [{
        "name": "Ball",
        "extensions": {
            "OMI_physics_body": {
                "type": "dynamic"
            }
        }
    }]
}
```


The `static` body type is used to define nodes which act as immovable "walls" within a scene, and can be used for level geometry which other objects might get blocked by.
The `kinematic` type behaves similarly to `static`, but it is optimized to be moved by scripts. We're hoping to use this type as an engine hint for now, and more specifically when we figure out WASM scripting with glTF objects.
The `dynamic` body type acts as a movable object within a scene, such as items on a table that a user might interact with.
Finally, the `trigger` type is used to define a collision area which doesn't interact with physics bodies, but might be used by scripts in order to trigger some form of interaction.

The implementors of this spec will look at the node's `extensions` to look for a `OMI_collider` object to attach a collision box

## Example

This spec acts in tandem with the collider spec to define physical objects in a scene.
For example, one can specify a node that has a `sphere` collider type, that also has a `dynamic` physics body type to define a `ball` within a glTF scene that a player might be able to bump into.

```json=
{
    "nodes": [{
        "name": "Ball",
        "extensions": {
            "OMI_physics_body": {
                "type": "dynamic"
            },
            "OMI_collider": {
                "type": "sphere",
                "radius": 0.5
            }
        }
    }]
}
```
