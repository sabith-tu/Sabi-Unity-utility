using UnityEngine;

public class AiCanHear : MonoBehaviour
{
    public AllThingsAiCanHear whatIsThis;
}

public enum AllThingsAiCanHear
{
    Non,
    PlayerFootsteps,
    Distraction
}