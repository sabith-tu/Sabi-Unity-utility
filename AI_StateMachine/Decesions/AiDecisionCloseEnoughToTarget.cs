using _Project.AI_StateMachine.Interface;
using Sirenix.OdinInspector;
using UnityEngine;

public class AiDecisionCloseEnoughToTarget : SabiDecisionBase, ITargetSettable
{
    [SerializeField] private Transform target;
    [SerializeField] private float distanceToCheck = 10;

    [DisplayAsString] [SerializeField] float distanceToTarget;

    public void SetTargetTransform(Transform value) => target = value;

    public override bool GetResult()
    {
        FindDistanceToTarget();
        return (distanceToTarget < distanceToCheck);
    }

    void FindDistanceToTarget()
    {
        distanceToTarget = Vector3.Distance(transform.position, target.position);
    }
}