using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public class AiTransition_CanGoToIdle : MonoBehaviour
{
    [SerializeField] private Transform target;
    [SerializeField] private float minChaseDistance = 25;
    [SerializeField] private float currentDistance;

    [SerializeField] private UnityEvent onTrue;

    public void CheckTransition()
    {
        currentDistance = Vector3.Distance(transform.position, target.position);
        if (currentDistance > minChaseDistance) onTrue.Invoke();
    }
}
