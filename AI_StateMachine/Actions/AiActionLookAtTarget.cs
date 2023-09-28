using System;
using _Project.AI_StateMachine.Interface;
using DG.Tweening;
using UnityEngine;
using UnityEngine.Serialization;

[AddComponentMenu(("_SABI/StateMachine/Action/LookAtTarget"))]
public class AiActionLookAtTarget : SabiActionBase, ITargetSettable
{
    [SerializeField] private Transform ownerBody;
    [SerializeField] Transform target;
    private float transformPositionY;

    public void SetTargetTransform(Transform value) => target = value;

    private void Start() => transformPositionY = transform.position.y;

    public override void ActionStart() { }

    public override void ActionUpdate()
    {
        Vector3 lookAt = target.position;
        lookAt.y = transformPositionY;
        ownerBody.DOLookAt(lookAt, 0.2f);
    }

    public override void ActionExit() => ownerBody.rotation = Quaternion.identity;
}