using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AiSensorHearing : MonoBehaviour
{
    private AiCanHear _currentSound = null;

    [SerializeField] private AiDesetionCanHearDistraction aiDecisionCanHearDistraction;
    [SerializeField] private AiDesetionCanHearPlayerRunning aiDecisionCanHearPlayerRunning;

    public AiCanHear GetCurrentSound() => _currentSound;

    private WaitForSeconds _waitForSeconds;
    [SerializeField] private float delayToCheck = 0.3f;
    [SerializeField] private float radius = 10f;

    private Collider[] _colliders;


    private IEnumerator Start()
    {
        _waitForSeconds = new WaitForSeconds(delayToCheck);
        while (true)
        {
            CheckForHearingSensor();
            yield return _waitForSeconds;
        }
    }

    void CheckForHearingSensor()
    {
        Collider[] colliders = Physics.OverlapSphere(transform.position, radius);

        bool canListen = false;

        foreach (var VARIABLE in colliders)
        {
            AiCanHear aiCanHear = VARIABLE.GetComponent<AiCanHear>();

            if (aiCanHear != null)
            {
                Debug.Log("I heard something");
                _currentSound = aiCanHear;
                aiDecisionCanHearDistraction.SetValue(true);
                canListen = true;
            }
        }

        if (canListen == false) _currentSound = null;

        aiDecisionCanHearDistraction.SetValue(canListen && _currentSound.whatIsThis == AllThingsAiCanHear.Distraction);
        aiDecisionCanHearPlayerRunning.SetValue(canListen &&
                                                _currentSound.whatIsThis == AllThingsAiCanHear.PlayerFootsteps);
    }
}